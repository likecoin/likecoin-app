import Rate, { AndroidMarket } from "react-native-rate"
import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { withEnvironment } from "../extensions"
import { UserModel } from "../user"
import { UserAppMetaModel } from "../user-app-meta"
import { AuthCoreStoreModel } from "../authcore-store"
import { IAPStoreModel } from "../iapStore"

import {
  updateAnalyticsUser,
  logoutAnalyticsUser,
} from '../../utils/analytics'

import {
  APIOptions,
  GeneralResult,
  User,
  UserLoginParams,
  UserResult,
  UserRegisterParams,
  UserAppMetaResult,
} from "../../services/api"

import { throwProblem } from "../../services/api/api-problem"

import { logError } from "../../utils/error"

/**
 * Store user related information.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    currentUser: types.maybe(UserModel),
    authCore: types.optional(AuthCoreStoreModel, {}),
    iapStore: types.optional(IAPStoreModel, {}),
    appRatingLastPromptedVersion: types.maybe(types.string),
    appRatingCooldown: types.optional(types.number, 0),
    appReferrer: types.optional(types.string, ''),
    userAppReferralLink: types.maybe(types.string),
    appMeta: types.optional(UserAppMetaModel, {}),
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
    get crispChatEmbeddedURL() {
      const crispWebSiteID = self.env.appConfig.getValue("CRISP_WEBSITE_ID")
      let uri: string
      if (crispWebSiteID) {
        const { profile } = self.authCore
        uri = `https://go.crisp.chat/chat/embed/?website_id=${crispWebSiteID}`
        if (self.currentUser?.email) {
          uri += `&email=${encodeURIComponent(self.currentUser.email)}`
        }
        if (profile?.primaryPhone) {
          uri += `&phone=${encodeURIComponent(profile.primaryPhone)}`
        }
      } else {
        uri = "https://help.like.co"
      }
      return uri
    },
    get hasPromptedAppRating() {
      return self.appRatingLastPromptedVersion &&
        parseInt(self.appRatingLastPromptedVersion, 10) >=
        parseInt(self.getConfig("APP_RATING_MIN_VERSION"), 10)
    },
    get shouldPromptForReferrer() {
      return !self.appReferrer && self.appMeta.isNew
    },
  }))
  .views(self => ({
    get shouldPromptAppRating() {
      return !self.hasPromptedAppRating && Date.now() >= self.appRatingCooldown
    },
  }))
  .actions(self => ({
    setIsSigningIn(value: boolean) {
      self.isSigningIn = value
    },
    didPromptAppRating() {
      if (!self.hasPromptedAppRating) {
        self.appRatingLastPromptedVersion = self.getConfig("APP_VERSION")
      }
      self.appRatingCooldown = 0
    },
    startAppRatingCooldown() {
      self.appRatingCooldown =
        Date.now() +
        (parseInt(self.getConfig("APP_RATING_COOLDOWN"), 10) || 5) *
        60000
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
        self.env.branchIO.setUserIdentity()
        yield logoutAnalyticsUser()
      } finally {
        self.isSigningOut = false
      }
    }),
    updateUserFromResultData(data: User) {
      const {
        user: likerID,
        displayName,
        email,
        avatar: avatarURL,
        isSubscribedCivicLiker: isCivicLiker,
      } = data
      self.currentUser = UserModel.create({
        likerID,
        displayName,
        email,
        avatarURL,
        isCivicLiker,
      })
    },
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
          } = result.data
          self.updateUserFromResultData(result.data)
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
    fetchLikerLandUserInfo: flow(function * (opts: APIOptions = {}) {
      const result: UserResult = yield self.env.likerLandAPI.fetchCurrentUserInfo(opts)
      switch (result.kind) {
        case "ok":
          self.updateUserFromResultData(result.data)
          break

        case "unauthorized":
          if (!opts.isSlient) {
            yield self.logout()
          }
      }
    }),
    rateApp: flow(function * () {
      try {
        yield new Promise((resolve, reject) => {
          Rate.rate({
            AppleAppID: "1248232355",
            GooglePackageName: "com.oice",
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: true,
            openAppStoreIfInAppFails: true,
          }, (success) => {
            if (success) {
              // This technically only tells us if the user successfully went to the Review Page.
              // Whether they actually did anything, we do not know.
              self.didPromptAppRating()
              resolve()
            } else {
              reject(new Error("APP_RATE_ERROR"))
            }
          })
        })
      } catch (error) {
        logError(error)
      }
    }),
    fetchUserAppMeta: flow(function * () {
      const result: UserAppMetaResult = yield self.env.likeCoAPI.fetchUserAppMeta()
      switch (result.kind) {
        case "ok": {
          const {
            isNew,
            isEmailVerified,
            ts: firstOpenTs,
            android: hasAndroid,
            ios: hasIOS,
          } = result.data
          self.appMeta = UserAppMetaModel.create({
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
      const result: GeneralResult = yield self.env.likeCoAPI.addUserAppReferrer(likerID)
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
