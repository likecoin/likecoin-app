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
    cosmosAddress: types.maybe(types.string),
  })
  .actions(self => ({
    init: flow(function * (
      accessToken: string,
      idToken: string,
      profile?: AuthCoreUser
    ) {
      const env: Environment = getEnv(self)
      yield env.authCoreAPI.setup(accessToken)

      self.accessToken = accessToken
      self.idToken = idToken
      if (profile) self.profile = profile

      self.cosmosAddress = yield env.authCoreAPI.getCosmosAddress()
    }),
    signOut: flow(function * () {
      const env: Environment = getEnv(self)
      yield env.authCoreAPI.signOut()

      self.accessToken = undefined
      self.idToken = undefined
      self.profile = undefined
    }),
  }))

type AuthcoreStoreType = Instance<typeof AuthCoreStoreModel>
export interface AuthcoreStore extends AuthcoreStoreType {}
type AuthcoreStoreSnapshotType = SnapshotOut<typeof AuthCoreStoreModel>
export interface AuthcoreStoreSnapshot extends AuthcoreStoreSnapshotType {}
