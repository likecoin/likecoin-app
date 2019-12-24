import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { AuthCoreUserModel, AuthCoreUser } from "../authcore-user"
import { withEnvironment } from "../extensions"

import * as Keychain from "../../utils/keychain"

/**
 * AuthCore store
 */
export const AuthCoreStoreModel = types
  .model("AuthCoreStore")
  .props({
    profile: types.maybe(AuthCoreUserModel),
    cosmosAddresses: types.optional(types.array(types.string), []),
  })
  .volatile(() => ({
    refreshToken: "",
    accessToken: "",
    idToken: "",
    hasSignedIn: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get primaryCosmosAddress() {
      return self.cosmosAddresses[0]
    },
  }))
  .actions(self => ({
    fetchCurrentUser: flow(function * () {
      const currentUser: any = yield self.env.authCoreAPI.getCurrentUser(self.accessToken)
      self.profile = AuthCoreUserModel.create(currentUser)
    }),
    fetchCosmosAddress: flow(function * () {
      self.cosmosAddresses = yield self.env.authCoreAPI.getCosmosAddresses()
    }),
    signOut: flow(function * () {
      self.accessToken = ""
      self.idToken = ""
      self.hasSignedIn = false
      self.profile = undefined
      yield Keychain.reset(self.getConfig("AUTHCORE_CREDENTIAL_KEY"))
      yield Keychain.reset(`${self.getConfig("AUTHCORE_CREDENTIAL_KEY")}/access_token`)
      yield Keychain.reset(`${self.getConfig("AUTHCORE_CREDENTIAL_KEY")}/refresh_token`)
      yield Keychain.reset(`${self.getConfig("AUTHCORE_CREDENTIAL_KEY")}/id_token`)
      yield self.env.authCoreAPI.signOut()
    })
  }))
  .actions(self => ({
    init: flow(function * (
      refreshToken: string,
      accessToken: string,
      idToken: string,
      profile?: AuthCoreUser,
    ) {
      self.refreshToken = refreshToken
      self.idToken = idToken
      if (profile) self.profile = profile

      const {
        accessToken: newAccessToken = ""
      }: any = yield self.env.authCoreAPI.setupModules(refreshToken, accessToken)
      self.accessToken = newAccessToken
      if (newAccessToken) {
        yield self.fetchCosmosAddress()
      } else {
        self.cosmosAddresses = undefined
      }
    }),
  }))
  .actions(self => ({
    signIn: flow(function * () {
      const {
        accessToken,
        refreshToken,
        idToken,
        currentUser,
      }: any = yield self.env.authCoreAPI.signIn()
      self.hasSignedIn = true
      yield Keychain.save(
        'likerland_refresh_token',
        refreshToken,
        `${self.getConfig('AUTHCORE_CREDENTIAL_KEY')}/refresh_token`
      )
      yield Keychain.save(
        'likerland_access_token',
        accessToken,
        `${self.getConfig('AUTHCORE_CREDENTIAL_KEY')}/access_token`
      )
      yield Keychain.save(
        'likerland_id_token',
        idToken,
        `${self.getConfig('AUTHCORE_CREDENTIAL_KEY')}/id_token`
      )
      yield self.init(refreshToken, accessToken, idToken, currentUser)
    }),
  }))

type AuthcoreStoreType = Instance<typeof AuthCoreStoreModel>
export interface AuthcoreStore extends AuthcoreStoreType {}
type AuthcoreStoreSnapshotType = SnapshotOut<typeof AuthCoreStoreModel>
export interface AuthcoreStoreSnapshot extends AuthcoreStoreSnapshotType {}
