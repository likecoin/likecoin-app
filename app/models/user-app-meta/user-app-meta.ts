import { Instance, SnapshotOut, flow, types } from "mobx-state-tree"
import { IntroContentList } from "../../services/app-config/app-config.type";
import { withEnvironment } from "../extensions"

const ONE_DAY_IN_MS = 86400000;
const ONE_HOUR_IN_MS = 3600000;

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
    lastIntroContentUpdateTs: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .views(self => ({
    get shouldShowIntroContent() {
      const { firstOpenTs } = self;
      const now = Date.now()
      if (now - ONE_DAY_IN_MS * 7 > firstOpenTs) return false;
      const list = self.env.appConfig.getValue("INTRO_CONTENT_SUPERLIKE_ID_LIST") as IntroContentList
      return (list && list.length > self.introContentIndex)
    },
    get getIntroContent() {
      const list = self.env.appConfig.getValue("INTRO_CONTENT_SUPERLIKE_ID_LIST") as IntroContentList
      if (list && list.length <= self.introContentIndex) return null;
      return list[self.introContentIndex];
    },
  }))
  .actions(self => ({
    postResume: flow( function * () {
      const { firstOpenTs, lastIntroContentUpdateTs } = self;
      const now = Date.now()
      if (now - ONE_DAY_IN_MS * 7 > firstOpenTs) return;
      if (now - ONE_HOUR_IN_MS * 18 < lastIntroContentUpdateTs) return;
      const list = self.env.appConfig.getValue("INTRO_CONTENT_SUPERLIKE_ID_LIST") as IntroContentList
      if (list && list.length > self.introContentIndex) {
        self.introContentIndex += 1
        self.lastIntroContentUpdateTs = Date.now()
      }
    }),
  })
)

type UserAppMetaType = Instance<typeof UserAppMetaModel>
export interface UserAppMetaStore extends UserAppMetaType {}
type UserAppMetaSnapshotType = SnapshotOut<typeof UserAppMetaModel>
export interface UserAppMetaSnapshot extends UserAppMetaSnapshotType {}
