import { observable } from "mobx"
import BigNumber from "bignumber.js"
import {
  flow,
  getEnv,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { Environment } from "../environment"

import {
  CosmosMessage,
  CosmosSendResult,
} from "../../services/cosmos"
import {
  convertNanolikeToLIKE,
  parseCosmosCoin,
} from "../../services/cosmos/cosmos.utils"

// TODO: Obtain from remote config
const GAS_PRICE = 0 // nanolike

/**
 * Transfer store
 */
export const TransferStoreModel = types
  .model("TransferStore")
  .extend(self => {
    const env: Environment = getEnv(self)

    const errorMessage = observable.box("")
    const target = observable.box("")
    const amount = observable.box("0")
    const gas = observable.box(0)
    const txHash = observable.box("")

    let message: CosmosMessage

    const setError = (error: Error) => {
      errorMessage.set(`${error}`)
    }

    const setTarget = (newTarget: string = "") => {
      target.set(newTarget)
    }

    const setAmount = (newAmount: string = "0") => {
      amount.set(newAmount)
    }

    const createTransaction = flow(function * (fromAddress: string) {
      errorMessage.set("")
      gas.set(0)
      txHash.set("")
      message = env.cosmosAPI.createSendMessage(
        fromAddress,
        target.get(),
        amount.get()
      )

      const estimatedGas: number = yield message.simulate({})
      gas.set(estimatedGas)
    })

    const signTransaction = flow(function * (signer: any) {
      errorMessage.set("")
      try {
        const {
          hash,
          included,
        }: CosmosSendResult = yield message.send({
          gas: gas.get().toString(),
          gasPrices: [parseCosmosCoin(GAS_PRICE)],
        }, signer)
        txHash.set(hash)
        // TODO: Store hash for history
        yield included()
      } catch (error) {
        setError(error)
      }
    })

    const calculateFee = () => {
      return convertNanolikeToLIKE(gas.get() * GAS_PRICE)
    }

    const resetInput = () => {
      message = undefined
      errorMessage.set("")
      setTarget()
      setAmount()
      gas.set(0)
      txHash.set("")
    }

    return {
      actions: {
        createTransaction,
        setTarget,
        setAmount,
        signTransaction,
        resetInput,
      },
      views: {
        get errorMessage() {
          return errorMessage.get()
        },
        get target() {
          return target.get()
        },
        get amount() {
          return amount.get()
        },
        get fee() {
          return calculateFee()
        },
        get totalAmount() {
          return new BigNumber(calculateFee())
            .plus(new BigNumber(amount.get()))
            .toFixed()
        },
        get txHash() {
          return txHash.get()
        },
        get blockExplorerURL() {
          return env.bigDipper.getTransactionURL(txHash.get())
        },
      }
    }
  })

type TransferStoreType = Instance<typeof TransferStoreModel>
export interface TransferStore extends TransferStoreType {}
type TransferStoreSnapshotType = SnapshotOut<typeof TransferStoreModel>
export interface TransferStoreSnapshot extends TransferStoreSnapshotType {}
