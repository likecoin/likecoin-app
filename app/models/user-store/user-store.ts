import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { withEnvironment } from "../extensions"
import { UserModel } from "../user"
import { AppMetaModel } from "../app-meta"
import { AuthCoreStoreModel } from "../authcore-store"
import { IAPStoreModel } from "../iapStore"

import {
  updateAnalyticsUser,
  logoutAnalyticsUser,
} from '../../utils/analytics'

import {
  GeneralResult,
  UserLoginParams,
  UserResult,
  UserRegisterParams,
  AppMetaResult,
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
    appReferrer: types.optional(types.string, ''),
    userAppReferralLink: types.maybe(types.string),
    appMeta: types.optional(AppMetaModel, {}),
  })
  .volatile(() => ({
    isSigningIn: false,
    isSigningOut: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get signInURL() {
      return self.env.likerLandAPI.getSignInURL()
    },
    get shouldPromptForReferrer() {
      return !self.appReferrer && self.appMeta.isNew
    },
  }))
  .actions(self => ({
    setIsSigningIn(value: boolean) {
      self.isSigningIn = value
    },
    register: flow(function * (params: UserRegisterParams) {
      const appReferrer = yield self.env.branchIO.getAppReferrer()
      self.appReferrer = appReferrer
      const result: GeneralResult = yield self.env.likeCoAPI.register({
        appReferrer,
        ...params
      })
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
      const appReferrer = yield self.env.branchIO.getAppReferrer()
      self.appReferrer = appReferrer
      const result: GeneralResult = yield self.env.likeCoAPI.login({
        appReferrer,
        ...params
      })
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
      self.isSigningOut = true
      self.currentUser = undefined
      try {
        self.iapStore.clear()
        yield Promise.all([
          self.env.likeCoAPI.logout(),
          self.authCore.signOut(),
        ])
        self.env.branchIO.setUserIdentity('')
        yield logoutAnalyticsUser()
      } finally {
        self.isSigningOut = false
      }
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
            isSubscribedCivicLiker: isCivicLiker,
          } = result.data
          self.currentUser = UserModel.create({
            likerID,
            displayName,
            email,
            avatarURL,
            isCivicLiker,
          })
          const userPIISalt = self.env.appConfig.getValue("USER_PII_SALT")
          const cosmosWallet = self.authCore.primaryCosmosAddress
          const authCoreUserId = self.authCore.profile.id
          const primaryPhone = self.authCore.profile.primaryPhone
          /* set branch user id for consistent link data */
          self.env.branchIO.setUserIdentity(likerID)
          /* do not block user logic with analytics */
          updateAnalyticsUser({
            likerID,
            displayName,
            email,
            primaryPhone,
            intercomToken,
            oAuthFactors: self.env.authCoreAPI.getOAuthFactors(),
            cosmosWallet,
            authCoreUserId,
            userPIISalt,
          })
          break
        }
        case "unauthorized": {
          yield self.logout()
        }
      }
    }),
    fetchLikerLandUserInfo: flow(function * () {
      const result: UserResult = yield self.env.likerLandAPI.fetchCurrentUserInfo()
      switch (result.kind) {
        case "ok": {
          // Refresh session only, no user update for now
          break
        }
        case "unauthorized": {
          yield self.logout()
        }
      }
    }),
    fetchUserAppMeta: flow(function * () {
      const result: AppMetaResult = yield self.env.likeCoAPI.fetchAppMeta()
      switch (result.kind) {
        case "ok": {
          const {
            isNew,
            isEmailVerified,
            ts: firstOpenTs,
            android: hasAndroid,
            ios: hasIOS,
          } = result.data
          self.appMeta = AppMetaModel.create({
            isNew,
            isEmailVerified,
            firstOpenTs,
            hasAndroid,
            hasIOS,
          })
          break
        }
        default:
          throwProblem(result)
      }
    }),
    postUserAppReferrer: flow(function * (likerID: string) {
      const result: GeneralResult = yield self.env.likeCoAPI.addAppReferrer(likerID)
      switch (result.kind) {
        case "ok": {
          self.appMeta.isNew = false
          break
        }
        default:
          throwProblem(result)
      }
    }),
    handleAfterLikerLandSignIn: flow(function * () {
      const appReferrer = yield self.env.branchIO.getAppReferrer()
      if (appReferrer) yield self.env.likerLandAPI.followLiker(appReferrer)
    }),
    generateUserAppReferralLink: flow(function * () {
      const url = yield self.env.branchIO.generateAppReferralLink(self.currentUser.likerID)
      self.userAppReferralLink = url
    })
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
