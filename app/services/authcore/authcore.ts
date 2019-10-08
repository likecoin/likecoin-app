import {
  AUTHCORE_ROOT_URL as apiBaseURL,
  COSMOS_CHAIN_ID,
} from "react-native-dotenv"

import {
  AuthCoreAuthClient,
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
   * The instance interacting between client and AuthCore AuthAPI server.
   */
  authClient: AuthCoreAuthClient

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
  }

  async setup(accessToken: string) {
    this.authClient = await new AuthCoreAuthClient({
      apiBaseURL,
      callbacks: this.callbacks,
      accessToken,
    })
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
   * Sign out AuthCore
   */
  signOut() {
    return this.authClient.signOut()
  }
}
