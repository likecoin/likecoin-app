import { Platform } from "react-native";
import Rate, { AndroidMarket } from "react-native-rate"
import {
  getTrackingStatus,
  requestTrackingPermission,
  TrackingStatus,
} from "react-native-tracking-transparency"
import CookieManager, { Cookies } from "@react-native-cookies/cookies"
import EncryptedStorage from "react-native-encrypted-storage";
import {
  applySnapshot,
  flow,
  getRoot,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import {
  ImagePickerResponse,
  launchImageLibrary,
} from "react-native-image-picker"
import stringify from "fast-json-stable-stringify";

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
  GeneralResult,
  User,
  UserLoginParams,
  UserResult,
  UserRegisterParams,
  SuperLikeStatusResult,
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
    appRatingCooldown: types.optional(types.number, -1),
    appReferrer: types.optional(types.string, ''),
    userAppReferralLink: types.maybe(types.string),
    appMeta: types.optional(UserAppMetaModel, {}),
  })
  .volatile(() => ({
    isSigningIn: false,
    isSigningOut: false,
    trackingStatus: "not-determined" as TrackingStatus,
  }))
  .extend(withEnvironment)
  .views(self => ({
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
    get sponsorLink() {
      return `${self.getConfig("LIKERLAND_URL")}/${self.currentUser.likerID}/civic`
    },
    get shouldTrackUser() {
      return self.trackingStatus === "authorized" || self.trackingStatus === "unavailable"
    },
  }))
  .views(self => ({
    get shouldPromptAppRating() {
      return !self.hasPromptedAppRating && self.appRatingCooldown === 0
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
      self.appRatingCooldown = -1
    },
    startAppRatingCooldown() {
      self.appRatingCooldown = parseInt(self.getConfig("APP_RATING_COOLDOWN"), 10) || 5
    },
    reduceAppRatingCooldown() {
      self.appRatingCooldown -= 1
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
      if (self.isSigningOut) return
      self.isSigningOut = true
      self.authCore.setHasSignedIn(false)
      self.currentUser = undefined
      try {
        getRoot(self).reset()
        self.iapStore.clear()
        yield Promise.all([
          self.env.likeCoAPI.logout(),
          self.authCore.signOut(),
        ])
        self.env.branchIO.setUserIdentity()
        yield logoutAnalyticsUser()
      } finally {
        self.isSigningOut = false
        self.userAppReferralLink = undefined
        applySnapshot(self.iapStore, {})
        applySnapshot(self.appMeta, {})
      }

      if (Platform.OS === "ios") {
        // Saved auth cookie for share extension
        try {
          yield EncryptedStorage.removeItem("likecoin_auth" )
        } catch {
          // No-op
        }
      }
    }),
    deleteAccount: flow(function * (
      likeWallet,
      {
        signed: signedMessage,
        signature: { signature, pub_key: publicKey },
      }
    ) {
      yield self.env.likeCoAPI.deleteAccount(self.currentUser.likerID, {
        signature: {
          signature,
          publicKey: publicKey.value,
          message: stringify(signedMessage),
          from: likeWallet,
        },
        authCoreAccessToken: self.authCore.accessToken,
      })

      yield Promise.all([
        logoutAnalyticsUser(),
        self.authCore.signOut(),
      ])
      self.env.branchIO.setUserIdentity()
      self.userAppReferralLink = undefined
      applySnapshot(self.iapStore, {})
      applySnapshot(self.appMeta, {})
      self.authCore.setHasSignedIn(false)
      self.currentUser = undefined
      self.iapStore.clear()
      getRoot(self).reset()

      return true
    }),
    updateUserAvatar: flow(function * () {
      const oldAvatarURL = self.currentUser.avatarURL
      try {
        const response: ImagePickerResponse = yield launchImageLibrary({
          mediaType: 'photo',
        })
        if (response.didCancel || response.errorCode) return

        const [{ uri, fileName: name, type }] = response.assets
        self.currentUser.avatarURL = uri
        const result: GeneralResult = yield self.env.likeCoAPI.updateAvatar({
          uri,
          name,
          type,
        })
        switch (result.kind) {
          case "ok": {
            break
          }
          default:
            throwProblem(result)
        }
      } catch (error) {
        logError(error)
        self.currentUser.avatarURL = oldAvatarURL
      }
    }),
    updateUserFromResultData(data: User) {
      const {
        user: likerID,
        displayName,
        email,
        avatar: avatarURL,
        isSubscribedCivicLiker: isCivicLiker,
        likeWallet,
        cosmosWallet,
      } = data
      if (!self.currentUser || self.currentUser.likerID !== likerID) {
        self.currentUser = UserModel.create({
          likerID,
          displayName,
          email,
          avatarURL,
          isCivicLiker,
          likeWallet,
          cosmosWallet,
        })
      } else if (self.currentUser) {
        self.currentUser.displayName = displayName
        self.currentUser.email = email
        self.currentUser.avatarURL = avatarURL
        self.currentUser.isCivicLiker = isCivicLiker
        self.currentUser.likeWallet = likeWallet
        self.currentUser.cosmosWallet = cosmosWallet
      }
    },
    checkTrackingStatus: flow(function * () {
      let trackingStatus: TrackingStatus = yield getTrackingStatus()
      if (trackingStatus === "not-determined") {
        trackingStatus = yield requestTrackingPermission()
      }
      self.trackingStatus = trackingStatus
    }),
  }))
  .actions(self => {
    let userFetchPromise: Promise<[UserResult, SuperLikeStatusResult]>

    const fetchUserInfo = flow(function * () {
      const timezone = (new Date().getTimezoneOffset() / -60).toString()

      userFetchPromise = userFetchPromise ?? Promise.all([
        self.env.likeCoAPI.fetchCurrentUserInfo(),
        self.env.likeCoAPI.getMySuperLikeStatus(timezone),
      ])

      const [
        userResult,
        superLikeStatusResult
      ]: [UserResult, SuperLikeStatusResult] = yield userFetchPromise

      if (Platform.OS === "ios") {
        // Saved auth cookie for share extension
        try {
          const { likecoin_auth: authCookie }: Cookies = yield CookieManager.get(self.env.likeCoAPI.apisauce.getBaseURL())
          if (authCookie) {
            yield EncryptedStorage.setItem(authCookie.name , JSON.stringify(authCookie))
          }
        } catch {
          // No-op
        }
      }

      switch (userResult.kind) {
        case "ok": {
          const {
            user: likerID,
            displayName,
            email,
          } = userResult.data
          self.updateUserFromResultData(userResult.data)
          const userPIISalt = self.env.appConfig.getValue("USER_PII_SALT")
          const cosmosWallet = self.authCore.primaryCosmosAddress
          const authCoreUserId = self.authCore.profile.id
          const primaryPhone = self.authCore.profile.primaryPhone

          if (self.shouldTrackUser) {
            /* set branch user id for consistent link data */
            self.env.branchIO.setUserIdentity(likerID)
            /* do not block user logic with analytics */
            updateAnalyticsUser({
              likerID,
              displayName,
              email,
              primaryPhone,
              cosmosWallet,
              authCoreUserId,
              userPIISalt,
            })
          }

          switch (superLikeStatusResult.kind) {
            case "ok":
              const {
                isSuperLiker,
                canSuperLike,
                nextSuperLikeTs = -1,
                cooldown = 0,
              } = superLikeStatusResult.data
              self.currentUser.isSuperLiker = !!isSuperLiker
              self.currentUser.canSuperLike = !!canSuperLike
              self.currentUser.nextSuperLikeTimestamp = nextSuperLikeTs
              self.currentUser.superLikeCooldown = cooldown
              break

            default:
              throwProblem(superLikeStatusResult)
          }
          break
        }
        case "unauthorized": {
          yield self.logout()
        }
      }
    })

    return {
      fetchUserInfo: flow(function * () {
        try {
          yield fetchUserInfo()
        } finally {
          userFetchPromise = undefined
        }
      }),
    }
  })
  .actions(self => ({
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
              resolve(true)
            } else {
              reject(new Error("APP_RATE_ERROR"))
            }
          })
        })
      } catch (error) {
        logError(error)
      }
    }),
    postUserAppReferrer: flow(function * (likerID: string) {
      const result: GeneralResult = yield self.env.likeCoAPI.addUserAppReferrer(likerID)
      switch (result.kind) {
        case "ok": {
          self.appMeta.isNew = false
          yield self.env.likeCoinAPI.users.followers.add(likerID)
          break
        }
        default:
          throwProblem(result)
      }
    }),
    postResume: flow(function * () {
      yield self.appMeta.postResume();
    }),
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
