import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { AuthCoreUserModel, AuthCoreUser } from "../authcore-user"
import { Environment } from "../environment"
import { AuthCoreCallback } from "../../services/authcore"

/**
 * AuthCore store
 */
export const AuthCoreStoreModel = types
  .model("AuthCoreStore")
  .props({
    accessToken: types.maybe(types.string),
    idToken: types.maybe(types.string),
    profile: types.maybe(AuthCoreUserModel),
    cosmosAddresses: types.optional(types.array(types.string), []),
  })
  .extend(self => {
    const env: Environment = getEnv(self)

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
      callbacks?: AuthCoreCallback,
    ) {
      self.accessToken = accessToken
      self.idToken = idToken
      if (profile) self.profile = profile

      yield env.authCoreAPI.setup(accessToken, callbacks)
      yield fetchCosmosAddress()
      yield fetchCurrentUser()
    })

    const signIn = flow(function * (callbacks?: AuthCoreCallback) {
      const {
        accessToken,
        idToken,
      }: any = yield env.authCoreAPI.signIn()
      yield init(accessToken, idToken, null, callbacks)
    })

    const signOut = flow(function * () {
      yield env.authCoreAPI.signOut()

      self.accessToken = undefined
      self.idToken = undefined
      self.profile = undefined
    })

    return {
      actions: {
        fetchCurrentUser,
        init,
        signIn,
        signOut,
      },
    }
  })

type AuthcoreStoreType = Instance<typeof AuthCoreStoreModel>
export interface AuthcoreStore extends AuthcoreStoreType {}
type AuthcoreStoreSnapshotType = SnapshotOut<typeof AuthCoreStoreModel>
export interface AuthcoreStoreSnapshot extends AuthcoreStoreSnapshotType {}
