import { Instance, SnapshotOut, flow, getEnv, types } from "mobx-state-tree"
import { observable } from "mobx"

import { Environment } from "../environment"
import { UserModel } from "../user"
import { AuthCoreStoreModel } from "../authcore-store"
import { IAPStoreModel } from "../iapStore"

import {
  GeneralResult,
  UserLoginParams,
  UserResult,
  UserRegisterParams,
} from "../../services/api"

import { throwProblem } from "../../services/api/api-problem"

/**
 * Store user related information.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    currentUser: types.maybe(UserModel),
    authCore: types.optional(AuthCoreStoreModel, {}),
    iapStore: types.optional(IAPStoreModel, {}),
  })
  .extend(self => {
    const env: Environment = getEnv(self)

    const isSigningIn = observable.box(false)

    const setIsSigningIn = (value: boolean) => {
      isSigningIn.set(value)
    }

    const register = flow(function * (params: UserRegisterParams) {
      const result: GeneralResult = yield env.likeCoAPI.register(params)
      switch (result.kind) {
        case "ok":
          break
        case "bad-data":
          throw new Error("REGISTRATION_BAD_DATA")
        default:
          throwProblem(result)
      }
    })

    const login = flow(function * (params: UserLoginParams) {
      const result: GeneralResult = yield env.likeCoAPI.login(params)
      switch (result.kind) {
        case "ok":
          break
        case "not-found":
          throw new Error("USER_NOT_FOUND")
        default:
          throwProblem(result)
      }
    })

    const logout = flow(function * () {
      self.currentUser = undefined
      self.iapStore.clear()
      yield Promise.all([
        env.likeCoAPI.logout(),
        self.authCore.signOut(),
      ])
    })

    const fetchUserInfo = flow(function * () {
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
          break
        }
        case "unauthorized": {
          yield logout()
        }
      }
    })

    return {
      actions: {
        setIsSigningIn,
        register,
        login,
        logout,
        fetchUserInfo,
      },
      views: {
        get isSigningIn() {
          return isSigningIn.get()
        },
        get signInURL() {
          return env.likerLandAPI.getSignInURL()
        },
        get selectedWalletAddress() {
          return self.authCore.cosmosAddresses[0]
        },
      },
    }
  })

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
