import { Instance, SnapshotOut,flow, getEnv, types } from "mobx-state-tree"

import { Environment } from "../environment";
import { UserModel } from "../user";
import { UserResult } from "../../services/api";

/**
 * Store user related information.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    currentUser: types.maybe(UserModel)
  })
  .actions(self => ({
    login: flow(function * (platform: String, accessToken: String, firebaseIdToken: String) {
      const env: Environment = getEnv(self)
      yield env.api.login(platform, accessToken, firebaseIdToken)
    }),
    logout: flow(function * () {
      const env: Environment = getEnv(self)
      yield env.api.logout()
      self.currentUser = undefined
    }),
    fetchUserInfo: flow(function * () {
      const env: Environment = getEnv(self)
      const result: UserResult = yield env.api.fetchCurrentUserInfo()
      switch (result.kind) {
        case "ok": {
          const {
            user: likerID,
            displayName,
            email,
            avatar: avatarURL,
          } = result.data
          self.currentUser = UserModel.create({
            likerID,
            displayName,
            email,
            avatarURL,
          })
        }
      }
    })
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
