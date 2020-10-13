import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { UserAppMetaResult } from "../../services/api"
import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS } from "../../utils/date"

import { withEnvironment } from "../extensions"

import { IntroContentModel } from "./intro-content"

/**
 * App Meta
 */
export const UserAppMetaModel = types
  .model("UserAppMeta")
  .props({
    isNew: types.maybe(types.boolean),
    isEmailVerified: types.optional(types.boolean, false),
    firstOpenTs: types.optional(types.number, 0),
    hasAndroid: types.optional(types.boolean, false),
    hasIOS: types.optional(types.boolean, false),
    introContent: types.optional(IntroContentModel, {}),
  })
  .extend(withEnvironment)
  .views(self => ({
    getShouldShowIntroContent() {
      return (
        Date.now() - self.firstOpenTs < ONE_DAY_IN_MS * 7 &&
        self.introContent.list.length > self.introContent.index
      )
    },
  }))
  .actions(self => ({
    fetch: flow(function*() {
      const result: UserAppMetaResult = yield self.env.likeCoAPI.fetchUserAppMeta()
      if (result.kind === "ok") {
        const {
          isNew,
          isEmailVerified,
          ts: firstOpenTs,
          android: hasAndroid,
          ios: hasIOS,
        } = result.data
        self.isNew = isNew
        self.isEmailVerified = isEmailVerified
        self.firstOpenTs = firstOpenTs
        self.hasAndroid = hasAndroid
        self.hasIOS = hasIOS
      }
    }),
    postResume: flow(function*() {
      const now = Date.now()
      if (
        now - self.firstOpenTs < ONE_DAY_IN_MS * 7 &&
        now - self.introContent.lastUpdateTs >= ONE_HOUR_IN_MS * 18
      ) {
        self.introContent.increment()
      }
    }),
  }))

type UserAppMetaType = Instance<typeof UserAppMetaModel>
export interface UserAppMeta extends UserAppMetaType {}
type UserAppMetaSnapshotType = SnapshotOut<typeof UserAppMetaModel>
export interface UserAppMetaSnapshot extends UserAppMetaSnapshotType {}
