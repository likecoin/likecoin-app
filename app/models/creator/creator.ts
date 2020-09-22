import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { withCreatorsFollowStore, withEnvironment } from "../extensions"
import { UserModel } from "../user"

import { GeneralResult, UserResult } from "../../services/api"
import { logError } from "../../utils/error"

/**
 * Content creator model
 */
export const CreatorModel = UserModel.named("Creator")
  .props({
    lastFetchedAt: types.maybe(types.number),
  })
  .extend(withCreatorsFollowStore)
  .extend(withEnvironment)
  .volatile(() => ({
    hasFetchedDetails: false,
    isFetchingDetails: false,
    isShowUndoUnfollow: false,
  }))
  .views(self => ({
    get isLoading() {
      return self.lastFetchedAt === undefined || self.isFetchingDetails
    },
    get isFollowing() {
      return !!self.creatorsFollowStore.settings.get(self.likerID)
    },
    checkShouldFetchDetails() {
      return (
        self.lastFetchedAt === undefined ||
        Date.now() - self.lastFetchedAt >
          self.getNumericConfig("META_FETCHING_INTERVAL") * 1000
      )
    },
  }))
  .actions(self => {
    let isUpdatingFollow = false
    return {
      fetchDetails: flow(function*() {
        if (self.isFetchingDetails) return
        self.isFetchingDetails = true
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
          self.hasFetchedDetails = true
          self.isFetchingDetails = false
          self.lastFetchedAt = Date.now()
        }
      }),
      follow: flow(function*() {
        if (isUpdatingFollow || self.isFollowing) return
        isUpdatingFollow = true
        const isUndoing = self.isShowUndoUnfollow
        try {
          self.isShowUndoUnfollow = false
          self.creatorsFollowStore.update(self.likerID, true)
          const result: GeneralResult = yield self.env.likerLandAPI.followLiker(
            self.likerID,
          )
          if (result.kind !== "ok") {
            throw new Error("FOLLOW_FAILED")
          }
        } catch (error) {
          logError(error)
          self.creatorsFollowStore.update(self.likerID, false)
          if (isUndoing) {
            self.isShowUndoUnfollow = true
          }
        } finally {
          isUpdatingFollow = false
        }
      }),
      unfollow: flow(function*() {
        if (isUpdatingFollow || !self.isFollowing) return
        isUpdatingFollow = true
        try {
          self.creatorsFollowStore.update(self.likerID, false)
          self.isShowUndoUnfollow = true
          const result: GeneralResult = yield self.env.likerLandAPI.unfollowLiker(
            self.likerID,
          )
          if (result.kind !== "ok") {
            throw new Error("UNFOLLOW_FAILED")
          }
        } catch (error) {
          logError(error)
          self.creatorsFollowStore.update(self.likerID, true)
          if (self.isShowUndoUnfollow) {
            self.isShowUndoUnfollow = false
          }
        } finally {
          isUpdatingFollow = false
        }
      }),
    }
  })

type CreatorType = Instance<typeof CreatorModel>
export interface Creator extends CreatorType {}
type CreatorSnapshotType = SnapshotOut<typeof CreatorModel>
export interface CreatorSnapshot extends CreatorSnapshotType {}
