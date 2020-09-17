import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { AuthCoreUserModel, AuthCoreUser } from "../authcore-user"
import { withEnvironment } from "../extensions"

import { AuthcoreScreenOptions } from "../../services/authcore"
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
      return self.cosmosAddresses.length ? self.cosmosAddresses[0] : null
    },
    get credentialKeyPrefix() {
      return self.getConfig("AUTHCORE_CREDENTIAL_KEY")
    },
    getCredentialKeyFor(path: "access_token" | "refresh_token" | "id_token") {
      return `${this.credentialKeyPrefix}/${path}`
    },
  }))
  .actions(self => ({
    setHasSignedIn(value: boolean) {
      self.hasSignedIn = value
    },
    openSettingsWidget(options: AuthcoreScreenOptions) {
      self.env.authCoreAPI.openSettingsWidget({
        ...options,
        accessToken: self.accessToken,
      })
    },
  }))
  .actions(self => ({
    signOut: flow(function*() {
      self.setHasSignedIn(false)
      self.accessToken = ""
      self.idToken = ""
      self.profile = undefined
      yield Promise.all([
        self.env.authCoreAPI.signOut(),
        Keychain.reset(self.getCredentialKeyFor("access_token")),
        Keychain.reset(self.getCredentialKeyFor("refresh_token")),
        Keychain.reset(self.getCredentialKeyFor("id_token")),
      ])
    }),
  }))
  .extend(self => {
    let pendingInitPromise: Promise<void>

    const init = flow(function*(
      refreshToken: string,
      accessToken: string,
      idToken: string,
      profile?: AuthCoreUser,
    ) {
      self.refreshToken = refreshToken
      self.idToken = idToken
      if (profile) self.profile = profile

      const {
        accessToken: newAccessToken,
      }: {
        accessToken: string
      } = yield self.env.authCoreAPI.setupModules(refreshToken, accessToken)
      self.accessToken = newAccessToken
      pendingInitPromise = undefined
    })

    const initWallet = flow(function*(
      accessToken: string
    ) {
      const { addresses }: { addresses: string[] } = yield self.env.authCoreAPI.setupWallet(accessToken)
      self.cosmosAddresses.replace(addresses)
    })

    const resume = flow(function*() {
      const [
        { password: refreshToken },
        { password: accessToken },
        { password: idToken },
      ]: { password: string }[] = yield Promise.all([
        Keychain.load(self.getCredentialKeyFor("refresh_token")),
        Keychain.load(self.getCredentialKeyFor("access_token")),
        Keychain.load(self.getCredentialKeyFor("id_token")),
      ])
      yield init(refreshToken, accessToken, idToken)
      self.setHasSignedIn(true)
    })
    const postSignIn = flow(function*(result) {
      const {
        accessToken,
        refreshToken,
        idToken,
        currentUser,
      } = result;
      self.setHasSignedIn(true)
      yield Promise.all([
        init(refreshToken, accessToken, idToken, currentUser),
        initWallet(accessToken),
        Keychain.save(
          "authcore_refresh_token",
          refreshToken,
          self.getCredentialKeyFor("refresh_token"),
        ),
        Keychain.save(
          "authcore_access_token",
          accessToken,
          self.getCredentialKeyFor("access_token"),
        ),
        Keychain.save(
          "authcore_id_token",
          idToken,
          self.getCredentialKeyFor("id_token"),
        ),
      ])
    })
    return {
      views: {
        getIsSettingUp() {
          return !!pendingInitPromise
        },
      },
      actions: {
        signIn: flow(function*() {
          const result  = yield self.env.authCoreAPI.signIn()
          yield postSignIn(result);
        }),
        register: flow(function*() {
          const result  = yield self.env.authCoreAPI.register()
          yield postSignIn(result);
        }),
        resume: flow(function*() {
          pendingInitPromise = resume()
          yield pendingInitPromise
          yield initWallet(self.accessToken);
        }),
        fetchCurrentUser: flow(function*() {
          if (pendingInitPromise) yield pendingInitPromise
          const currentUser: any = yield self.env.authCoreAPI.getCurrentUser(
            self.accessToken,
          )
          self.profile = AuthCoreUserModel.create(currentUser)
        }),
      },
    }
  })

type AuthcoreStoreType = Instance<typeof AuthCoreStoreModel>
export interface AuthcoreStore extends AuthcoreStoreType {}
type AuthcoreStoreSnapshotType = SnapshotOut<typeof AuthCoreStoreModel>
export interface AuthcoreStoreSnapshot extends AuthcoreStoreSnapshotType {}
