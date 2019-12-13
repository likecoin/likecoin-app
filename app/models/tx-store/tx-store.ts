import {
  flow,
  getEnv,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { Environment } from "../environment"

import {
  CosmosMessage,
  CosmosSendResult,
} from "../../services/cosmos"
import { parseCosmosCoin } from "../../services/cosmos/cosmos.utils"

import { translateWithFallbackText } from "../../i18n"

/**
 * Create a tx related store with given name
 * 
 * @param name The store name
 */
export function createTxStore(name: string) {
  return types
  .model(name)
  .volatile(() => ({
    gasPrice: new BigNumber(0),
    fractionDigits: 0,
    fractionDenom: "",

    errorMessage: "",
    target: "",
    inputAmount: "",
    gas: new BigNumber(0),
    txHash: "",

    isCreatingTx: false,
    isSigningTx: false,
    isSuccess: false,
  }))
  .views(self => ({
    get fee() {
      return self.gas.times(self.gasPrice)
    },
    get amount() {
      return new BigNumber(self.inputAmount).shiftedBy(self.fractionDigits)
    },
    get blockExplorerURL() {
      const env: Environment = getEnv(self)
      return env.bigDipper.getTransactionURL(self.txHash)
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
      }
    },
  }))
  .actions(self => ({
    setError: (error: Error) => {
      const errorMessage = error.message || error.toString()
      self.errorMessage =  translateWithFallbackText(`error.${errorMessage}`, errorMessage)
      return false
    },
    setTarget: (newTarget: string = "") => {
      self.target = newTarget
      self.errorMessage = ""
    },
    setAmount: (value: string = "0") => {
      self.inputAmount = value
      self.errorMessage = ""
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
          const estimatedGas: number = yield message.simulate({})
          self.gas = new BigNumber(estimatedGas)
        } catch (error) {
          __DEV__ && console.tron.error(error, null)
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
          yield included()
          self.isSuccess = true
        } catch (error) {
          __DEV__ && console.tron.error(error, null)
          self.setError(error)
        } finally {
          self.isSigningTx = false
        }
      }),
    }
  })
}

/**
 * Base Tx store
 */
export const TxStoreModel = createTxStore("TxStore")

type TxStoreType = Instance<typeof TxStoreModel>
export interface TxStore extends TxStoreType {}
type TxStoreSnapshotType = SnapshotOut<typeof TxStoreModel>
export interface TxStoreSnapshot extends TxStoreSnapshotType {}
