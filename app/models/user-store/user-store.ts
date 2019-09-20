import { Instance, SnapshotOut,flow, getEnv, types } from "mobx-state-tree"

import { Environment } from "../environment";
import { UserModel } from "../user";
import { UserResult, UserLoginParams } from "../../services/api";

/**
 * Store user related information.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    currentUser: types.maybe(UserModel)
  })
  .actions(self => ({
    login: flow(function * (params: UserLoginParams) {
      const env: Environment = getEnv(self)
      yield env.likeCoAPI.login(params)
    }),
    logout: flow(function * () {
      const env: Environment = getEnv(self)
      yield env.likeCoAPI.logout()
      self.currentUser = undefined
    }),
    fetchUserInfo: flow(function * () {
      const env: Environment = getEnv(self)
      const result: UserResult = yield env.likeCoAPI.fetchCurrentUserInfo()
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
    }),
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
