import { Buffer } from "buffer"
import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { AuthCoreUserModel, AuthCoreUser } from "../authcore-user"
import { Environment } from "../environment"
import { BigDipper } from "../../services/big-dipper"
import { CosmosSignature } from "../../services/cosmos"

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
  .views(self => ({
    get bigDipperAccountURL() {
      return BigDipper.getAccountURL(self.cosmosAddress)
    },
    createSigner() {
      const env: Environment = getEnv(self)
      return async (message: string) => {
        const signedPayload = await env.authCoreAPI.cosmosProvider.sign(
          JSON.parse(message),
          self.cosmosAddress,
        )
        const {
          signature,
          pub_key: publicKey,
        } = signedPayload.signatures[signedPayload.signatures.length - 1]
        return {
          signature: Buffer.from(signature, 'base64'),
          publicKey: Buffer.from(publicKey.value, 'base64'),
        } as CosmosSignature
      }
    }
  }))
  .actions(self => ({
    init: flow(function * (
      accessToken: string,
      idToken: string,
      profile?: AuthCoreUser
    ) {
      self.accessToken = accessToken
      self.idToken = idToken
      if (profile) self.profile = profile
      
      const env: Environment = getEnv(self)
      yield env.authCoreAPI.setup(accessToken)
      self.cosmosAddress = yield env.authCoreAPI.getCosmosAddress()
    }),
    signIn: flow(function * () {
      const env: Environment = getEnv(self)
      const {
        accessToken,
        idToken,
      }: any = yield env.authCoreAPI.signIn()
      self.accessToken = accessToken
      self.idToken = idToken
      
      yield env.authCoreAPI.setup(accessToken)
      self.cosmosAddress = yield env.authCoreAPI.getCosmosAddress()
    }),
    signOut: flow(function * () {
      const env: Environment = getEnv(self)
      yield env.authCoreAPI.signOut()

      self.accessToken = undefined
      self.idToken = undefined
      self.profile = undefined
    }),
    getCurrentUser: flow(function * () {
      const env: Environment = getEnv(self)
      const currentUser: any = yield env.authCoreAPI.getCurrentUser()
      self.profile = AuthCoreUserModel.create(currentUser)
    }),
  }))

type AuthcoreStoreType = Instance<typeof AuthCoreStoreModel>
export interface AuthcoreStore extends AuthcoreStoreType {}
type AuthcoreStoreSnapshotType = SnapshotOut<typeof AuthCoreStoreModel>
export interface AuthcoreStoreSnapshot extends AuthcoreStoreSnapshotType {}
