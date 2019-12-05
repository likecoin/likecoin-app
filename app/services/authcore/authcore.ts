import AuthCore from "react-native-authcore"
import "crypto"
import { AuthcoreVaultClient, AuthcoreCosmosProvider } from "secretd-js"

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
  keyVaultClient: AuthcoreVaultClient

  /**
   * The Cosmos wallet provider.
   */
  cosmosProvider: AuthcoreCosmosProvider

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
    })
    this.cosmosChainId = cosmosChainId
    if (token) {
      await this.setupModules(token)
    }
  }

  async setupModules(refreshToken: string, accessToken?: string) {
    if (!accessToken) {
      try {
        const data = await this.client.auth.client.post("/api/auth/tokens", {
          grant_type: "REFRESH_TOKEN", // eslint-disable-line
          token: refreshToken,
        })
        accessToken = data.json.access_token
      } catch (err) {
        console.error(err)
      }
    }
    if (!accessToken) return
    this.client.auth.client.bearer = `Bearer ${accessToken}`

    __DEV__ && console.tron.log("Initializing AuthCore Key Vault Client")
    this.keyVaultClient = await new AuthcoreVaultClient({
      apiBaseURL: this.baseURL,
      accessToken,
    })

    __DEV__ && console.tron.log("Initializing AuthCore Cosmos Provider")
    this.cosmosProvider = await new AuthcoreCosmosProvider({
      client: this.keyVaultClient,
    })

    // Getting Cosmos addresses, it will be created if not exists
    await this.getCosmosAddresses()
    return { accessToken }
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
        const statusCode = error.response ? error.response.status : error.status
        switch (statusCode) {
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

  async cosmosSign(payload: Record<string, any>, address: string) {
    let signed
    try {
      signed = await this.cosmosProvider.sign(payload, address)
    } catch (error) {
      const statusCode = error.response ? error.response.status : error.status
      switch (statusCode) {
        case 401:
          this.onUnauthorized()
          break
        case 403:
          this.onUnauthenticated()
          break
        default:
          throw error
      }
    }
    return signed
  }

  /**
   * Sign in AuthCore
   */
  async signIn() {
    const {
      accessToken,
      refreshToken,
      idToken,
      currentUser,
    } = await this.client.webAuth.signin()
    return {
      accessToken,
      refreshToken,
      idToken,
      currentUser: parseAuthCoreUser(currentUser),
    }
  }

  /**
   * Sign out AuthCore
   */
  async signOut() {
    const { auth } = this.client
    try {
      await auth.client.delete("/api/auth/sessions")
    } finally {
      auth.client.bearer = ''
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
