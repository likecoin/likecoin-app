import AuthCore from "react-native-authcore"

import {
  AuthCoreKeyVaultClient,
  AuthCoreCosmosProvider,
} from "authcore-js/build/main.js"

/**
 * AuthCore callback functions to-be called
 */
export interface AuthCoreCallback {
  unauthenticated?: Function
  unauthorized?: Function
}

function parseAuthCoreUser({
  id,
  primary_email: primaryEmail,
  display_name: displayName,
  updated_at: updatedAt,
  created_at: createdAt,
  primary_email_verified: primaryEmailVerified,
  primary_phone_verified: primaryPhoneVerified,
}) {
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

/**
 * AuthCore Manager
 */
export class AuthCoreAPI {
  /**
   * The domain to AuthCore
   */
  baseURL: string

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
   * The chain ID for cosmos
   */
  cosmosChainId: string = ""

  /**
   * Callback function if error occurs
   */
  callbacks: AuthCoreCallback = {}

  async setup(baseURL: string, cosmosChainId: string, token?: string) {
    this.baseURL = baseURL
    this.client = new AuthCore({
      baseUrl: baseURL,
      token,
    })
    this.cosmosChainId = cosmosChainId
    if (token) {
      await this.setupModules(token)
    }
  }

  async setupModules(accessToken: string) {
    __DEV__ && console.tron.log("Initializing AuthCore Key Vault Client")
    this.keyVaultClient = await new AuthCoreKeyVaultClient({
      apiBaseURL: this.baseURL,
      accessToken,
      callbacks: this.getCallbacks(),
    })

    __DEV__ && console.tron.log("Initializing AuthCore Cosmos Provider")
    this.cosmosProvider = await new AuthCoreCosmosProvider({
      authcoreClient: this.keyVaultClient,
      chainId: this.cosmosChainId,
    })

    // Getting Cosmos addresses, create if without one
    const { length } = await this.getCosmosAddresses()
    if (!length) {
      await this.keyVaultClient.createSecret('HD_KEY', 16)
    }
  }

  private getCallbacks() {
    return {
      callbacks: {
        unauthenticated: this.onUnauthenticated,
        unauthorized: this.onUnauthorized
      },
    }
  }

  onUnauthenticated = () => {
    this.callbacks.unauthenticated && this.callbacks.unauthenticated()
  }

  onUnauthorized = () => {
    this.callbacks.unauthorized && this.callbacks.unauthorized()
  }

  async getCosmosAddresses() {
    let addresses: string[] = []
    if (this.cosmosProvider) {
      try {
        addresses = await this.cosmosProvider.getAddresses()
      } catch (error) {
        switch (error.statusCode) {
          case 401:
            this.onUnauthorized()
            break
          case 403:
            this.onUnauthenticated()
            break
        }
      }
    }
    return addresses
  }

  /**
   * Sign in AuthCore
   */
  async signIn() {
    const {
      accessToken,
      idToken,
      currentUser,
    } = await this.client.webAuth.signin()
    return {
      accessToken,
      idToken,
      currentUser: parseAuthCoreUser(currentUser),
    }
  }

  /**
   * Sign out AuthCore
   */
  async signOut() {
    const { webAuth } = this.client
    try {
      await webAuth.client.delete("/api/auth/sessions")
    } finally {
      webAuth.client.bearer = ''
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(accessToken: string) {
    const json = await this.client.auth.userInfo({ token: accessToken })
    return parseAuthCoreUser(json)
  }
}
