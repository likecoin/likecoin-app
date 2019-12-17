import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { withEnvironment } from "../extensions"
import { UserModel } from "../user"
import { AuthCoreStoreModel } from "../authcore-store"
import { IAPStoreModel } from "../iapStore"

import * as Intercom from "../../utils/intercom"
import { setSentryUser } from "../../utils/sentry"
import { setCrashlyticsUserId } from "../../utils/firebase"

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
  .volatile(() => ({
    isSigningIn: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get signInURL() {
      return self.env.likerLandAPI.getSignInURL()
    },
  }))
  .actions(self => ({
    setIsSigningIn(value: boolean) {
      self.isSigningIn = value
    },
    register: flow(function * (params: UserRegisterParams) {
      const result: GeneralResult = yield self.env.likeCoAPI.register(params)
      switch (result.kind) {
        case "ok":
          break
        case "bad-data":
          switch (result.data) {
            case "EMAIL_ALREADY_USED":
              throw new Error("REGISTRATION_EMAIL_ALREADY_USED")
            case "USER_ALREADY_EXIST":
              throw new Error("REGISTRATION_LIKER_ID_ALREADY_USED")
            default:
              throw new Error("REGISTRATION_BAD_DATA")
          }
        default:
          throwProblem(result)
      }
    }),
    login: flow(function * (params: UserLoginParams) {
      const result: GeneralResult = yield self.env.likeCoAPI.login(params)
      switch (result.kind) {
        case "ok":
          break
        case "not-found":
          throw new Error("USER_NOT_FOUND")
        default:
          throwProblem(result)
      }
    }),
    logout: flow(function * () {
      self.currentUser = undefined
      self.iapStore.clear()
      yield Promise.all([
        self.env.likeCoAPI.logout(),
        self.authCore.signOut(),
      ])
      Intercom.logout()
    }),
  }))
  .actions(self => ({
    fetchUserInfo: flow(function * () {
      const result: UserResult = yield self.env.likeCoAPI.fetchCurrentUserInfo()
      switch (result.kind) {
        case "ok": {
          const {
            user: likerID,
            displayName,
            email,
            avatar: avatarURL,
            intercomToken,
          } = result.data
          self.currentUser = UserModel.create({
            likerID,
            displayName,
            email,
            avatarURL,
          })
          Intercom.registerIdentifiedUser(likerID, intercomToken)
          const factors: any[] = yield self.env.authCoreAPI.getOAuthFactors()
          const services = factors.map(f => f.service)
          /* eslint-disable @typescript-eslint/camelcase */
          const opt = services.reduce((accumOpt, service) => {
            if (service) accumOpt[`binded_${service.toLowerCase()}`] = true
            return accumOpt
          }, { binded_authcore: true })
          Intercom.updateUser({
            name: displayName,
            email,
            custom_attributes: {
              has_liker_land_app: true,
              cosmos_wallet: self.authCore.primaryCosmosAddress,
              ...opt,
            }
          })
          const authCoreUserId = self.authCore.profile.id
          setSentryUser({ id: authCoreUserId })
          yield setCrashlyticsUserId(authCoreUserId)
          /* eslint-enable @typescript-eslint/camelcase */
          break
        }
        case "unauthorized": {
          yield self.logout()
        }
      }
    }),
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
