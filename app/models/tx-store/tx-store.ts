import {
  applySnapshot,
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { withEnvironment } from "../extensions"
import {
  CosmosMessage,
  CosmosSendResult,
  CosmosTxQueryResult,
} from "../../services/cosmos"
import { parseCosmosCoin } from "../../services/cosmos/cosmos.utils"
import { logError } from "../../utils/error"

import { translateWithFallbackText } from "../../i18n"

/**
 * Base Tx store
 */
export const TxStoreModel = types
  .model("TxStore")
  .volatile(() => ({
    gasPrice: new BigNumber(0),
    fractionDigits: 0,
    fractionDenom: "",

    errorMessage: "",
    target: "",
    inputAmount: "",
    gas: new BigNumber(0),
    memo: "",
    txHash: "",

    isCreatingTx: false,
    isSigningTx: false,
    isSuccess: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get fee() {
      return self.gas.times(self.gasPrice)
    },
    get amount() {
      return new BigNumber(self.inputAmount).shiftedBy(self.fractionDigits)
    },
    get blockExplorerURL() {
      return self.env.bigDipper.getTransactionURL(self.txHash)
    },
    get signingState() {
      if (self.isSuccess) return "success"
      if (self.isSigningTx) return "pending"
      return "waiting"
    },
  }))
  .views(self => ({
    get totalAmount() {
      return self.amount.plus(self.fee)
    },
    getMeta() {
      return {
        gas: self.gas.toFixed(),
        gasPrices: [parseCosmosCoin(self.gasPrice.toFixed(), self.fractionDenom)],
        memo: self.memo,
      }
    },
  }))
  .actions(self => ({
    reset() {
      applySnapshot(self, {})
    },
    setErrorMessage(message: string) {
      self.errorMessage = message
    },
    setError: (error: Error) => {
      const errorMessage = error.message || error.toString()
      self.errorMessage = translateWithFallbackText(`error.${errorMessage}`, errorMessage)
      return false
    },
    setTarget: (newTarget = "") => {
      self.target = newTarget
      self.errorMessage = ""
    },
    setAmount: (value = "0", isBigNumber = false) => {
      if (isBigNumber) {
        const normalized = new BigNumber(value).shiftedBy(-self.fractionDigits)
        self.inputAmount = normalized.toFixed()
      } else {
        self.inputAmount = value
      }
      self.errorMessage = ""
    },
    setMemo: (newMemo = "") => {
      self.memo = newMemo
    },
  }))
  .actions(self => {
    let message: CosmosMessage

    return {
      initialize(fractionDenom: string, fractionDigits: number, gasPrice: BigNumber) {
        self.fractionDigits = fractionDigits
        self.gasPrice = gasPrice
        self.fractionDenom = fractionDenom

        self.errorMessage = ""
        self.setTarget("")
        self.setAmount()
        self.gas = new BigNumber(0)
        self.txHash = ""
        self.memo = ""

        self.isCreatingTx = false
        self.isSigningTx = false
        self.isSuccess = false
      },
      createTx: flow(function * (newMessage: CosmosMessage) {
        if (self.isCreatingTx) return
        message = newMessage

        self.isCreatingTx = true
        self.errorMessage = ""
        self.txHash = ""
        try {
          let estimatedGas: number = yield message.simulate({ memo: self.memo })
          if (estimatedGas === 0) {
            estimatedGas = 200000
          }
          self.gas = new BigNumber(estimatedGas)
        } catch (error) {
          logError(error)
          self.setError(error)
        } finally {
          self.isCreatingTx = false
        }
      }),
      signTx: flow(function * (signer: any) {
        if (self.isSigningTx) return

        self.isSigningTx = true
        self.errorMessage = ""
        self.txHash = ""
        try {
          const { hash, included }: CosmosSendResult = yield message.send(self.getMeta(), signer)
          self.txHash = hash
          // TODO: Store hash for history
          const response: CosmosTxQueryResult = yield included()
          if (response?.logs[0]?.success) {
            self.isSuccess = true
            return
          }
          const error = new Error("COSMOS_TX_FAILED")
          error["response"] = response
          throw error
        } catch (error) {
          logError(error)
          if (error.response) {
            try {
              const response: CosmosTxQueryResult = yield error.response.json()
              const message = JSON.parse(response.logs[0]?.log)
              self.setErrorMessage(message)
              return
            } catch {
              // Do nothing
            }
          }
          self.setError(error)
        } finally {
          self.isSigningTx = false
        }
      }),
    }
  })

type TxStoreType = Instance<typeof TxStoreModel>
export interface TxStore extends TxStoreType {}
type TxStoreSnapshotType = SnapshotOut<typeof TxStoreModel>
export interface TxStoreSnapshot extends TxStoreSnapshotType {}
