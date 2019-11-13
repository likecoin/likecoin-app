import { observable } from "mobx"
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
 * Staking rewards withdraw store
 */
export const StakingRewardsWithdrawStoreModel = types
  .model("StakingRewardsWithdrawStore")
  .extend(self => {
    const env: Environment = getEnv(self)

    const errorMessage = observable.box("")
    const gas = observable.box(0)
    const txHash = observable.box("")

    let message: CosmosMessage

    const setError = (error: Error) => {
      errorMessage.set(`${error}`)
    }

    const createTransaction = flow(function * (
      fromAddress: string,
      validatorAddresses: string[],
    ) {
      errorMessage.set("")
      gas.set(0)
      txHash.set("")
      message = env.cosmosAPI.createRewardsWithdrawMessage(fromAddress, validatorAddresses)

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
      gas.set(0)
      txHash.set("")
    }

    return {
      actions: {
        createTransaction,
        signTransaction,
        resetInput,
      },
      views: {
        get errorMessage() {
          return errorMessage.get()
        },
        get fee() {
          return calculateFee()
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

type StakingRewardsWithdrawStoreType = Instance<typeof StakingRewardsWithdrawStoreModel>
export interface StakingRewardsWithdrawStore extends StakingRewardsWithdrawStoreType {}
type StakingRewardsWithdrawStoreSnapshotType = SnapshotOut<typeof StakingRewardsWithdrawStoreModel>
export interface StakingRewardsWithdrawStoreSnapshot extends StakingRewardsWithdrawStoreSnapshotType {}
