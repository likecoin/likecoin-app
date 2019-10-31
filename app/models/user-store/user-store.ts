import { Instance, SnapshotOut,flow, getEnv, types } from "mobx-state-tree"

import { Environment } from "../environment";
import { UserModel } from "../user";
import { UserResult, UserLoginParams, GeneralResult } from "../../services/api";
import { AuthCoreStoreModel } from "../authcore-store";

/**
 * Store user related information.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    currentUser: types.maybe(UserModel),
    isSigningIn: types.optional(types.boolean, false),
    authCore: types.optional(AuthCoreStoreModel, {}),
  })
  .actions(self => ({
    setIsSigningIn(value: boolean) {
      self.isSigningIn = value
    },
    login: flow(function * (params: UserLoginParams) {
      const env: Environment = getEnv(self)
      const result: GeneralResult = yield env.likeCoAPI.login(params)
      switch (result.kind) {
        case "not-found":
          throw new Error("USER_NOT_FOUND")
      }
    }),
    logout: flow(function * () {
      const env: Environment = getEnv(self)
      yield env.likeCoAPI.logout()
      self.currentUser = undefined
      yield self.authCore.signOut()
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
  .views(self => ({
    get selectedWalletAddress() {
      return self.authCore.cosmosAddresses[0]
    },
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
