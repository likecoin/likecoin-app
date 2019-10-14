import { NativeModules } from "react-native"
import {
  AUTHCORE_ROOT_URL as apiBaseURL,
  COSMOS_CHAIN_ID,
} from "react-native-dotenv"

import AuthCore from "react-native-authcore"
import url from "url"

import {
  AuthCoreKeyVaultClient,
  AuthCoreCosmosProvider,
} from "authcore-js/build/main.js"

/**
 * AuthCore callback functions to-be called
 */
export interface AuthCoreCallback {
  unauthenticated?: Function
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

  /**
   * The set of callback functions to-be called.
   */
  callbacks: AuthCoreCallback

  constructor(callbacks = {}) {
    this.callbacks = callbacks

    this.client = new AuthCore({
      baseUrl: apiBaseURL
    })
  }

  async setup(accessToken: string) {
    const { webAuth } = this.client
    webAuth.client.bearer = `Bearer ${accessToken}`

    this.keyVaultClient = await new AuthCoreKeyVaultClient({
      apiBaseURL,
      accessToken,
    })
    this.cosmosProvider = await new AuthCoreCosmosProvider({
      authcoreClient: this.keyVaultClient,
      chainId: COSMOS_CHAIN_ID,
    })
    const { length } = await this.cosmosProvider.getAddresses()
    if (!length) {
      await this.keyVaultClient.createSecret('HD_KEY', 16)
    }
  }

  async getCosmosAddress() {
    if (!this.cosmosProvider) return undefined
    const [cosmosAddress] = await this.cosmosProvider.getAddresses()
    return cosmosAddress
  }

  /**
   * Sign in AuthCore
   */
  async signIn() {
    // XXX: Hack version of webAuth.signin()
    const { webAuth } = this.client

    // Sign in
    const redirectURI = `${NativeModules.Authcore.bundleIdentifier}://${webAuth.baseUrl.replace(/https?:\/\//, "")}`
    const redirectURL = await webAuth.agent.show(`${webAuth.baseUrl}/widgets/oauth?client_id=authcore.io&response_type=code&redirect_uri=${redirectURI}`, false)
    const query = url.parse(redirectURL, true).query
    const {
      json: {
        access_token: accessToken,
        id_token: idToken,
      },
    } = await webAuth.client.post("/api/auth/tokens", {
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
    return webAuth.client.delete("/api/auth/sessions")
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
