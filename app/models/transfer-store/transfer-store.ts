import {
  flow,
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { createTxStore } from "../tx-store"
import { User, UserModel } from "../user"
import { UserResult } from "../../services/api"

/**
 * Transfer store
 */
export const TransferStoreModel = createTxStore("TransferStore")
  .volatile(() => ({
    liker: null as User,
    isFetchingLiker: false,
  }))
  .views(self => ({
    get receiverAddress() {
      return self.liker ? self.liker.cosmosWallet : self.target
    },
  }))
  .actions(self => {
    function handleLikerFetchingResult(result: UserResult) {
      switch (result.kind) {
        case "ok": {
          const {
            user: likerID,
            displayName,
            email,
            avatar: avatarURL,
            cosmosWallet,
          } = result.data
          self.liker = UserModel.create({
            likerID,
            displayName,
            email,
            avatarURL,
            cosmosWallet,
          })
          break
        }
      }
    }

    return {
      setReceiver(receiver: string) {
        self.setTarget(receiver)
        self.liker = null
      },
      createTransferTx: flow(function * (fromAddress: string) {
        yield self.createTx(self.env.cosmosAPI.createSendMessage(
          fromAddress,
          self.receiverAddress,
          self.amount.toFixed(),
          self.fractionDenom,
        ))
      }),
      fetchLikerByWalletAddress: flow(function * () {
        self.isFetchingLiker = true
        const result: UserResult = yield self.env.likeCoAPI.fetchUserInfoByWalletAddress(self.target)
        handleLikerFetchingResult(result)
        self.isFetchingLiker = false
      }),
      fetchLikerById: flow(function * () {
        self.isFetchingLiker = true
        const result: UserResult = yield self.env.likeCoAPI.fetchUserInfoById(self.target.toLowerCase())
        handleLikerFetchingResult(result)
        self.isFetchingLiker = false
      }),
    }
  })

type TransferStoreType = Instance<typeof TransferStoreModel>
export interface TransferStore extends TransferStoreType {}
type TransferStoreSnapshotType = SnapshotOut<typeof TransferStoreModel>
export interface TransferStoreSnapshot extends TransferStoreSnapshotType {}
