import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { AuthCoreUserModel, AuthCoreUser } from "../authcore-user"
import { Environment } from "../environment"

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
      profile?: AuthCoreUser
    ) {
      self.accessToken = accessToken
      self.idToken = idToken
      if (profile) self.profile = profile

      yield env.authCoreAPI.setup(accessToken)
      yield fetchCosmosAddress()
      yield fetchCurrentUser()
    })

    const signIn = flow(function * () {
      const {
        accessToken,
        idToken,
      }: any = yield env.authCoreAPI.signIn()
      self.accessToken = accessToken
      self.idToken = idToken
      

      yield env.authCoreAPI.setup(self.accessToken)
      yield fetchCosmosAddress()
      yield fetchCurrentUser()
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
