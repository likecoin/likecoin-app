import {
  applySnapshot,
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { BroadcastTxResponse } from "@cosmjs/stargate"

import { withEnvironment } from "../extensions"
import {
  CosmosMessage,
  CosmosSigningClient,
  CosmosTxQueryResult,
} from "../../services/cosmos"
import { parseCosmosCoin } from "../../services/cosmos/cosmos.utils"
import { logError } from "../../utils/error"

import { translateWithFallbackText } from "../../i18n"

import { TxError, TxInsufficientGasFeeError } from "./tx-error"

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
        fee: {
          gas: self.gas.toFixed(),
          amount: [parseCosmosCoin(self.gasPrice.toFixed(), self.fractionDenom)]
        },
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
      const opts: any = {}
      if (error.message === 'TX_INSUFFICIENT_GAS_FEE') {
        opts.diff = (error as TxInsufficientGasFeeError).diff
      }
      self.errorMessage = translateWithFallbackText(`error.${errorMessage}`, errorMessage, opts)
      return false
    },
    setTarget: (newTarget = "") => {
      self.target = newTarget
      self.errorMessage = ""
    },
    setAmount: (value: string | BigNumber = "0") => {
      if (value instanceof BigNumber) {
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

    function handleKnownError(error: Error) {
      const message: string = error.message || error.toString()

      const [
        isInsufficientAmount = false,
        availableBalance = '0',
        gasFee = '0',
      ] = message.match(/insufficient funds to pay for fees; (\d+)nanolike < (\d+)nanolike/) || []
      if (isInsufficientAmount) {
        const diff = new BigNumber(gasFee)
          .minus(new BigNumber(availableBalance))
          .shiftedBy(-self.fractionDigits)
          .toFixed()
        self.setError(new TxInsufficientGasFeeError(diff));
        return true
      }

      if (message.startsWith('The transaction was still not included in a block.')) {
        self.setError(new TxError('TX_NOT_INCLUDED_YET'));
        self.isSuccess = true
        return true
      }

      return false
    }

    return {
      initialize(fractionDenom: string, fractionDigits: number) {
        self.fractionDigits = fractionDigits
        self.gasPrice = new BigNumber(self.getConfig("COSMOS_GAS_PRICE"))
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
      createTx: flow(function* (newMessage: CosmosMessage) {
        if (self.isCreatingTx) return
        message = newMessage

        self.isCreatingTx = true
        self.errorMessage = ""
        self.txHash = ""
        try {
          const estimatedGas = self.env.cosmosAPI.simulateGas(newMessage)
          self.gas = new BigNumber(estimatedGas)
        } catch (error) {
          logError(error)
          self.setError(error)
        } finally {
          self.isCreatingTx = false
        }
      }),
      signTx: flow(function* (signer: OfflineDirectSigner) {
        if (self.isSigningTx) return

        self.isSigningTx = true
        self.errorMessage = ""
        self.txHash = ""
        try {
          const client: CosmosSigningClient = yield self.env.cosmosAPI.createSigningClient(signer)
          const response: BroadcastTxResponse = yield client.signAndBroadcast({ ...message, ...self.getMeta() })
          self.txHash = response.transactionHash
          // TODO: Store hash for history
          if (!('code' in response)) {
            self.isSuccess = true
            return
          }
          const error = new Error("COSMOS_TX_FAILED")
          error["response"] = response
          throw error
        } catch (error) {
          if (handleKnownError(error)) {
            return
          }

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
