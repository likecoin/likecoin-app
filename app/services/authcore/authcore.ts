import { NativeModules } from "react-native"
import AuthCore from "react-native-authcore"

import {
  AuthCoreKeyVaultClient,
  AuthCoreCosmosProvider,
} from "authcore-js/build/main.js"

import Url from "url-parse"

/**
 * AuthCore callback functions to-be called
 */
export interface AuthCoreCallback {
  unauthenticated?: Function
  unauthorized?: Function
}

/**
 * AuthCore Manager
 */
export class AuthCoreAPI {
  /**
   * The AuthCore client
   */
  client: AuthCore

  /**
   * The instance interacting between client and AuthCore KeyVaultAPI server.
   */
  keyVaultClient: AuthCoreKeyVaultClient

  /**
   * The Cosmos wallet provider.
   */
  cosmosProvider: AuthCoreCosmosProvider

  constructor(apiBaseURL: string) {
    this.client = new AuthCore({
      baseUrl: apiBaseURL
    })
  }

  async setup(
    apiBaseURL: string,
    accessToken: string,
    cosmosChainId: string,
    callbacks: AuthCoreCallback
  ) {
    const { webAuth } = this.client
    webAuth.client.bearer = `Bearer ${accessToken}`

    __DEV__ && console.tron.log("Initializing AuthCore Key Vault Client")
    this.keyVaultClient = await new AuthCoreKeyVaultClient({
      apiBaseURL,
      accessToken,
      callbacks,
    })

    __DEV__ && console.tron.log("Initializing AuthCore Cosmos Provider")
    this.cosmosProvider = await new AuthCoreCosmosProvider({
      authcoreClient: this.keyVaultClient,
      chainId: cosmosChainId,
      callbacks,
    })

    const { length } = await this.cosmosProvider.getAddresses()
    if (!length) {
      await this.keyVaultClient.createSecret('HD_KEY', 16)
    }
  }

  async getCosmosAddresses() {
    if (!this.cosmosProvider) return []
    const addresses: string[] = await this.cosmosProvider.getAddresses()
    return addresses
  }

  /**
   * Sign in AuthCore
   */
  async signIn() {
    // XXX: Hack version of webAuth.signin()
    const { webAuth } = this.client

    // Sign in
    const redirectURI = `${NativeModules.Authcore.bundleIdentifier}://${webAuth.baseUrl.replace(/https?:\/\//, "")}`

    let redirectURL: string
    try {
      redirectURL = await webAuth.agent.show(`${webAuth.baseUrl}/widgets/oauth?client_id=authcore.io&response_type=code&redirect_uri=${redirectURI}`, false)
    } catch (error) {
      if (error.error === "authcore.session.user_cancelled") {
        throw new Error("USER_CANCEL_AUTH")
      }
      throw error
    }

    const query = new Url(redirectURL, true).query
    const {
      json: {
        access_token: accessToken,
        id_token: idToken,
      },
    } = await webAuth.client.post("/api/auth/tokens", {
      // eslint-disable-next-line @typescript-eslint/camelcase
      grant_type: "AUTHORIZATION_TOKEN",
      token: query.code
    })

    return {
      accessToken,
      idToken,
    }
  }

  /**
   * Sign out AuthCore
   */
  signOut() {
    const { webAuth } = this.client
    return webAuth.client.delete("/api/auth/sessions").then(() => {
      webAuth.client.bearer = ''
    })
  }

  /**
   * Get current user info
   */
  async getCurrentUser() {
    const { webAuth } = this.client
    const {
      json: {
        id,
        primary_email: primaryEmail,
        display_name: displayName,
        updated_at: updatedAt,
        created_at: createdAt,
        primary_email_verified: primaryEmailVerified,
        primary_phone_verified: primaryPhoneVerified,
      }
    } = await webAuth.client.request('GET', webAuth.client.url('/api/auth/users/current'))

    return {
      id,
      primaryEmail,
      displayName,
      updatedAt,
      createdAt,
      primaryEmailVerified,
      primaryPhoneVerified,
    }
  }
}
