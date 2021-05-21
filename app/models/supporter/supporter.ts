import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { UserResult } from "../../services/api"
import { logError } from "../../utils/error"

import { withEnvironment, withStatus } from "../extensions"
import { UserModel } from "../user"

/**
 * Supporter Model
 */
export const SupporterModel = UserModel
  .named("Supporter")
  .props({
    quantity: types.number,
    timestamp: types.optional(types.number, 0),
    lastEffectiveTimestamp: types.optional(types.number, 0),
    lastEffectiveQuantity: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions(self => ({
    fetchDetails: flow(function*() {
      if (self.status === "pending") return
      self.setStatus("pending")
      try {
        const result: UserResult = yield self.env.likeCoAPI.fetchUserInfoById(
          self.likerID,
        )
        switch (result.kind) {
          case "ok": {
            const {
              displayName,
              avatar: avatarURL,
              cosmosWallet,
              isSubscribedCivicLiker,
            } = result.data
            self.displayName = displayName
            self.avatarURL = avatarURL
            self.cosmosWallet = cosmosWallet
            self.isCivicLiker = isSubscribedCivicLiker
            break
          }
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.setStatus("done")
      }
    }),
  }))

type SupporterType = Instance<typeof SupporterModel>
export interface Supporter extends SupporterType {}
type SupporterSnapshotType = SnapshotOut<typeof SupporterModel>
export interface SupporterSnapshot extends SupporterSnapshotType {}
