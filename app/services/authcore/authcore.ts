import AuthCore from "react-native-authcore"
import "crypto"
import jwt from "jsonwebtoken"
import { AuthcoreVaultClient, AuthcoreCosmosProvider } from "secretd-js"
import { AccountData, DirectSignResponse, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { color } from "../../theme"

import { findBestAvailableLanguage } from "./authcore.utils"

/**
 * AuthCore callback functions to-be called
 */
export interface AuthCoreCallback {
  unauthenticated?: (error: any) => void
  unauthorized?: (error: any) => void
}

export interface AuthcoreScreenOptions {
  accessToken?: string
  company?: string
  logo?: string
  primaryColour?: string
  dangerColour?: string
  successColour?: string
  language?: string
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
  cosmosChainId = ""

  /**
   * Callback function if error occurs
   */
  callbacks: AuthCoreCallback = {}

  setup(baseURL: string, cosmosChainId: string) {
    this.baseURL = baseURL
    this.client = new AuthCore({
      baseUrl: baseURL,
      socialLoginPaneStyle: "top",
      language: findBestAvailableLanguage(),
      company: "Liker Land",
      initialScreen: "register",
      primaryColour: color.primary,
      successColour: color.primary,
      dangerColour: color.palette.angry,
    })
    this.cosmosChainId = cosmosChainId
  }

  async setupModules(refreshToken: string, accessToken?: string) {
    let needToRefresh = true
    if (accessToken) {
      const token: any = jwt.decode(accessToken)
      const tokenExpirationMs = token.exp * 1000
      /* check expire in 1 hr */
      needToRefresh = tokenExpirationMs - 3600000 < Date.now()
    }
    if (needToRefresh) {
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
    if (!accessToken) {
      return {
        accessToken: "",
      }
    }

    this.client.auth.client.bearer = `Bearer ${accessToken}`

    return {
      accessToken,
    }
  }

  async setupWallet(accessToken: string) {
    if (__DEV__) console.tron.log("Initializing AuthCore Key Vault Client")
    this.keyVaultClient = await new AuthcoreVaultClient({
      apiBaseURL: this.baseURL,
      accessToken,
    })

    if (__DEV__) console.tron.log("Initializing AuthCore Cosmos Provider")
    this.cosmosProvider = await new AuthcoreCosmosProvider({
      client: this.keyVaultClient,
    })

    // Getting Cosmos addresses, it will be created if not exists
    const { addresses } = await this.getCosmosAddressesAndPubKeys()
    return {
      addresses,
    }
  }

  onUnauthenticated = (error: any) => {
    if (this.callbacks.unauthenticated) this.callbacks.unauthenticated(error)
  }

  onUnauthorized = (error: any) => {
    if (this.callbacks.unauthorized) this.callbacks.unauthorized(error)
  }

  async getCosmosAddressesAndPubKeys() {
    let addresses: string[] = []
    let pubKeys: string[] = []
    if (this.cosmosProvider) {
      try {
        addresses = await this.cosmosProvider.getAddresses()
        pubKeys = await this.cosmosProvider.getPubKeys()
      } catch (error) {
        const statusCode = error.response ? error.response.status : error.status
        switch (statusCode) {
          case 401:
            this.onUnauthorized(error)
            break
          case 403:
            this.onUnauthenticated(error)
            break
          default:
            throw error
        }
      }
    }
    return { addresses, pubKeys }
  }

  async cosmosSign(payload: Record<string, any>, address: string) {
    let signed
    if (!this.cosmosProvider) throw new Error('WALLET_NOT_INITED');
    try {
      signed = await this.cosmosProvider.sign(payload, address)
    } catch (error) {
      const statusCode = error.response ? error.response.status : error.status
      switch (statusCode) {
        case 401:
          this.onUnauthorized(error)
          break
        case 403:
          this.onUnauthenticated(error)
          break
        default:
          throw error
      }
    }
    return signed
  }

  getOfflineDirectSigner(): OfflineDirectSigner {
    const chainId = this.cosmosChainId
    const getAddressesAndPubKeys = this.getCosmosAddressesAndPubKeys;
    const sign = this.cosmosSign;

    return {
      async getAccounts(): Promise<readonly AccountData[]> {
        const { addresses, pubKeys } = await getAddressesAndPubKeys()
        const address = addresses[0]
        const pubkey = Uint8Array.from(Buffer.from(pubKeys[0], 'hex'))

        return [{
          address,
          algo: 'secp256k1',
          pubkey,
        }]
      },
    
      async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
        if (chainId !== signDoc.chainId) {
          throw new Error('Unmatched chain ID with Authcore signer')
        }
        const dataWithSig = await sign(signDoc, signerAddress)
        return dataWithSig
      }
    }
  }

  async getOAuthFactors() {
    const { auth } = this.client
    const { json } = await auth.client.get("/api/auth/oauth_factors")
    let { oauth_factors: oAuthFactors = [] } = json
    /* handle FACEBOOK is missing due to being default */
    oAuthFactors = oAuthFactors.map(f => {
      if (!f.service) {
        return { ...f, service: 'FACEBOOK' }
      }
      return f
    })
    return oAuthFactors
  }


  /**
   * Sign in AuthCore
   */
  async signIn(options: {
    initialScreen?: string
    language?: string
  }) {
    const {
      accessToken,
      refreshToken,
      idToken,
      currentUser,
    } = await this.client.webAuth.signin(options)
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

  /**
   * Open Authcore settings widgets in in-app webview
   * @param accessToken Authcore access token
   * @param primaryColour Theme color
   * @param company Text label in the top
   */
  openSettingsWidget(options: AuthcoreScreenOptions) {
    this.client.settings.show(options)
  }
}
