import {
  flow,
  getEnv,
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { createTxStore } from "../tx-store"
import { Environment } from "../environment"

/**
 * Transfer store
 */
export const TransferStoreModel = createTxStore("TransferStore")
  .actions(self => ({
    createTransferTx: flow(function * (fromAddress: string) {
      const env: Environment = getEnv(self)
      yield self.createTx(env.cosmosAPI.createSendMessage(
        fromAddress,
        self.target,
        self.amount.toFixed(),
        self.fractionDenom,
      ))
    }),
  }))

type TransferStoreType = Instance<typeof TransferStoreModel>
export interface TransferStore extends TransferStoreType {}
type TransferStoreSnapshotType = SnapshotOut<typeof TransferStoreModel>
export interface TransferStoreSnapshot extends TransferStoreSnapshotType {}
