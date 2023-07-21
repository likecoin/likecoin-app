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
  LikerLandUserFolloweeListResult,
  NFTClassListResult,
  NFTEvent,
  LikerLandUserInfoResult,
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
    unseenEventCount: 0,
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
  .actions(self => ({
    loginLikerLand: flow(function * () {
      yield self.authCore.waitForInit()
      const address = self.authCore.primaryCosmosAddress
      const signingPayload = {
        /* eslint-disable @typescript-eslint/camelcase */
        chain_id: self.env.appConfig.getValue('COSMOS_CHAIN_ID'),
        memo: [
          `${self.env.appConfig.getValue('LIKERLAND_LOGIN_MESSAGE')}:`,
          JSON.stringify({
            ts: Date.now(),
            address,
          }),
        ].join(' '),
        msgs: [],
        fee: {
          gas: '0',
          amount: [
            {
              denom: self.env.appConfig.getValue('COSMOS_FRACTION_DENOM'),
              amount: '0',
            },
          ],
        },
        sequence: '0',
        account_number: '0',
        /* eslint-enable @typescript-eslint/camelcase */
      };
      const {
        signed,
        signature: {
          signature,
          pub_key: publicKey
        },
      }: any = yield self.env.authCoreAPI.signAmino(signingPayload, address)
      const data = {
        signature,
        publicKey: publicKey.value,
        message: stringify(signed),
        from: address,
        signMethod: 'memo',
      };
      yield self.env.likerLandAPI.login(data)
    }),
    fetchLikerLandFollowees: flow(function * () {
      const result: LikerLandUserFolloweeListResult = yield self.env.likerLandAPI.fetchUserFolloweeList()
      switch (result.kind) {
        case "ok": {
          return result.data
        }
        default:
          throwProblem(result)
          return undefined
      }
    }),
  }))
  .actions(self => {
    async function fetchFolloweeNewClassEvents(followee: string) {
      const result: NFTClassListResult = await self.env.likeCoinChainAPI.fetchNFTClassList({
        iscnOwner: followee,
        reverse: true,
      })
      switch (result.kind) {
        case "ok":
          return result.data.map(({ id, created_at: timestamp }) => ({
            /* eslint-disable @typescript-eslint/camelcase */
            action: 'new_class',
            class_id: id,
            nft_id: '',
            sender: followee,
            receiver: '',
            tx_hash: '',
            timestamp,
            memo: '',
            /* eslint-enable @typescript-eslint/camelcase */
          } as NFTEvent))

        default:
          return []
      }
    }

    function getEventType(event: NFTEvent) {
      const user = self.authCore.primaryCosmosAddress
      let eventType;
      if (event.action === "new_class") {
        eventType = "mint_nft"
      } else if (event.action === "buy_nft" || event.action === "sell_nft") {
        if (event.receiver === user) {
          eventType = "purchase_nft"
        } else {
          eventType = "nft_sale"
        }
      } else if (event.sender === self.env.appConfig.getValue('LIKECOIN_NFT_API_WALLET')) {
        if (event.receiver === user) {
          eventType = "purchase_nft"
        } else {
          eventType = "nft_sale"
        }
      } else if (event.receiver === user) {
        eventType = "receive_nft"
      } else if (event.sender === user) {
        eventType = "send_nft"
      } else {
        eventType = "transfer_nft"
      }
      return eventType;
    }

    return {
      loadUnseenEventCount: flow(function * () {
        const userInfoResult: LikerLandUserInfoResult = yield self.env.likerLandAPI.fetchUserInfo()
        if (userInfoResult.kind !== "ok") return
        
        const { eventLastSeenTs } = userInfoResult.data

        const { followees }: { followees: string[] } = yield self.fetchLikerLandFollowees();

        const eventResponses: NFTEvent[][] = yield Promise.all([
          self.env.likeCoinChainAPI.fetchNFTEvents({
            involver: self.authCore.primaryCosmosAddress,
            limit: 100,
            actionType: ["/cosmos.nft.v1beta1.MsgSend", "buy_nft"],
            ignoreToList: self.env.appConfig.getValue('LIKECOIN_NFT_API_WALLET'),
            reverse: true,
          }).then((result) => result.kind === 'ok' ? result.data : []).catch(() => []),
          ...followees.map(fetchFolloweeNewClassEvents)
        ])
        const events = eventResponses.flat()
        self.unseenEventCount = events.reduce((count, event) => {
          if (
            eventLastSeenTs < new Date(event.timestamp).getTime() &&
            ["nft_sale", "receive_nft", "mint_nft"].includes(getEventType(event))
          ) {
            return count + 1
          }
          return count
        }, 0)
      }),
      clearUnseenEventCount() {
        self.unseenEventCount = 0
      },
    }
  });

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
