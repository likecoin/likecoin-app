import { observable } from "mobx"
import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { Environment } from "../environment"
import { ValidatorModel } from "../validator"
import { nanolikeToLIKE } from "../../utils/number"

/**
 * Wallet related store
 */
export const WalletStoreModel = types
  .model("WalletStore")
  .extend(self => {
    const env: Environment = getEnv(self)

    const balance = observable.box("0")
    const isFetchingBalance = observable.box(false)
    const hasFetchedBalance = observable.box(false)

    const fetchBalance = flow(function * (address: string) {
      isFetchingBalance.set(true)
      try {
        balance.set(yield env.cosmosAPI.queryBalance(address))
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchBalance: ${error}`, null)
      } finally {
        isFetchingBalance.set(false)
        hasFetchedBalance.set(true)
      }
    })

    return {
      views: {
        get formattedBalance() {
          return nanolikeToLIKE(balance.get())
        },
        get isFetchingBalance() {
          return isFetchingBalance.get()
        },
        get hasFetchedBalance() {
          return hasFetchedBalance.get()
        },
      },
      actions: {
        fetchBalance,
      }
    }
  })
 
type WalletStoreType = Instance<typeof WalletStoreModel>
export interface WalletStore extends WalletStoreType {}
type WalletStoreSnapshotType = SnapshotOut<typeof WalletStoreModel>
export interface WalletStoreSnapshot extends WalletStoreSnapshotType {}
