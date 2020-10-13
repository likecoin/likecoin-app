import { Instance, SnapshotOut, flow, types } from "mobx-state-tree"

import { IntroContentList } from "../../services/app-config/app-config.type"

import { withEnvironment } from "../extensions"

const ONE_DAY_IN_MS = 86400000
const ONE_HOUR_IN_MS = 3600000

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
    introContentIndex: types.optional(types.number, 0),
    introContentLastUpdateTs: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .views(self => ({
    get introContentList() {
      return (self.env.appConfig.getValue("INTRO_CONTENT_SUPERLIKE_ID_LIST") ||
        []) as IntroContentList
    },
  }))
  .views(self => ({
    getShouldShowIntroContent() {
      if (Date.now() - ONE_DAY_IN_MS * 7 > self.firstOpenTs) return false
      return self.introContentList.length > self.introContentIndex
    },
    get currentIntroContent() {
      if (self.introContentList.length <= self.introContentIndex) return null
      return self.introContentList[self.introContentIndex]
    },
  }))
  .actions(self => ({
    postResume: flow(function*() {
      const { firstOpenTs, introContentLastUpdateTs: lastIntroContentUpdateTs } = self
      const now = Date.now()
      if (now - ONE_DAY_IN_MS * 7 > firstOpenTs) return
      if (now - ONE_HOUR_IN_MS * 18 < lastIntroContentUpdateTs) return
      if (self.introContentList.length > self.introContentIndex) {
        self.introContentIndex += 1
        self.introContentLastUpdateTs = Date.now()
      }
    }),
  }))

type UserAppMetaType = Instance<typeof UserAppMetaModel>
export interface UserAppMetaStore extends UserAppMetaType {}
type UserAppMetaSnapshotType = SnapshotOut<typeof UserAppMetaModel>
export interface UserAppMetaSnapshot extends UserAppMetaSnapshotType {}
