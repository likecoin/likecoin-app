import { observable } from "mobx"
import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { AuthCoreUserModel, AuthCoreUser } from "../authcore-user"
import { Environment } from "../environment"
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
  .extend(self => {
    const env: Environment = getEnv(self)

    const _accessToken = observable.box("")
    const _refreshToken = observable.box("")
    const _idToken = observable.box("")
    const _hasSignedIn = observable.box(false)

    const fetchCurrentUser = flow(function * () {
      const currentUser: any = yield env.authCoreAPI.getCurrentUser(_accessToken.get())
      self.profile = AuthCoreUserModel.create(currentUser)
    })

    const fetchCosmosAddress = flow(function * () {
      self.cosmosAddresses = yield env.authCoreAPI.getCosmosAddresses()
    })

    const init = flow(function * (
      refreshToken: string,
      idToken: string,
      accessToken?: string,
      profile?: AuthCoreUser,
    ) {
      _refreshToken.set(refreshToken)
      _idToken.set(idToken)
      if (profile) self.profile = profile

      const {
        accessToken: newAccessToken = ""
      } = yield env.authCoreAPI.setupModules(refreshToken, accessToken)
      _accessToken.set(newAccessToken)
      if (newAccessToken) {
        yield fetchCosmosAddress()
      } else {
        self.cosmosAddresses = undefined
      }
    })

    const signIn = flow(function * () {
      const {
        accessToken,
        refreshToken,
        idToken,
        currentUser,
      }: any = yield env.authCoreAPI.signIn()
      _hasSignedIn.set(true)
      yield Keychain.save('likerland_refresh_token', refreshToken, env.appConfig.getValue("AUTHCORE_CREDENTIAL_KEY"))
      yield init(refreshToken, idToken, accessToken, currentUser)
    })

    const signOut = flow(function * () {
      _accessToken.set("")
      _idToken.set("")
      _hasSignedIn.set(false)
      self.profile = undefined
      yield Keychain.reset(env.appConfig.getValue("AUTHCORE_CREDENTIAL_KEY"))
      yield env.authCoreAPI.signOut()
    })

    return {
      actions: {
        fetchCurrentUser,
        init,
        signIn,
        signOut,
      },
      views: {
        get accessToken() {
          return _accessToken.get()
        },
        get idToken() {
          return _idToken.get()
        },
        get hasSignedIn() {
          return _hasSignedIn.get()
        },
      }
    }
  })

type AuthcoreStoreType = Instance<typeof AuthCoreStoreModel>
export interface AuthcoreStore extends AuthcoreStoreType {}
type AuthcoreStoreSnapshotType = SnapshotOut<typeof AuthCoreStoreModel>
export interface AuthcoreStoreSnapshot extends AuthcoreStoreSnapshotType {}
