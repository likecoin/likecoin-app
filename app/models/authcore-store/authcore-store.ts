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
    const _idToken = observable.box("")

    const fetchCurrentUser = flow(function * () {
      const currentUser: any = yield env.authCoreAPI.getCurrentUser()
      self.profile = AuthCoreUserModel.create(currentUser)
    })

    const fetchCosmosAddress = flow(function * () {
      self.cosmosAddresses = yield env.authCoreAPI.getCosmosAddresses()
    })

    const init = flow(function * (
      accessToken: string,
      idToken: string,
      profile?: AuthCoreUser,
    ) {
      _accessToken.set(accessToken)
      _idToken.set(idToken)
      if (profile) self.profile = profile

      yield env.authCoreAPI.authenticate(accessToken)
      yield fetchCosmosAddress()
      yield fetchCurrentUser()
    })

    const signIn = flow(function * () {
      const {
        accessToken,
        idToken,
      }: any = yield env.authCoreAPI.signIn()
      yield Keychain.save(idToken, accessToken, env.appConfig.getValue("AUTHCORE_CREDENTIAL_KEY"))
      yield init(accessToken, idToken)
    })

    const signOut = flow(function * () {
      yield env.authCoreAPI.signOut()
      Keychain.reset(env.appConfig.getValue("AUTHCORE_CREDENTIAL_KEY"))

      _accessToken.set("")
      _idToken.set("")
      self.profile = undefined
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
      }
    }
  })

type AuthcoreStoreType = Instance<typeof AuthCoreStoreModel>
export interface AuthcoreStore extends AuthcoreStoreType {}
type AuthcoreStoreSnapshotType = SnapshotOut<typeof AuthCoreStoreModel>
export interface AuthcoreStoreSnapshot extends AuthcoreStoreSnapshotType {}
