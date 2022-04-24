import AuthCore from "react-native-authcore"
import "crypto"
import jwt from "jsonwebtoken"
import { AuthcoreVaultClient, AuthcoreCosmosProvider } from "@nwingt/secretd"
import {
  AccountData,
  DirectSignResponse,
  makeSignBytes,
  OfflineDirectSigner
} from "@cosmjs/proto-signing"
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import CryptoJS from "crypto-js";
import { pubkeyToAddress } from "@cosmjs/amino"

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

  async getPubKeys() {
    let pubKeys: string[] = []
    if (this.cosmosProvider) {
      try {
        const result = await Promise.all([this.cosmosProvider.getPublicKeys()])
        pubKeys = result[0]
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
    return pubKeys
  }

  getBech32Address(chainId: string, pubKey: string) {
    let hrp: string
    switch (chainId) {
      case "osmosis-1":
        hrp = "osmo"
        break

      case "cosmoshub-4":
      case "iscn-dev-chain-2":
      case "likecoin-mainnet-2":
        hrp = "cosmos"
        break

      case "likecoin-public-testnet-5":
        hrp = "like"
        break

      case "crypto-org-chain-mainnet-1":
        hrp = "cro"
        break

      case "columbus-5":
        hrp = "luna"
        break

      default:
        return undefined
    }

    const bech32Address = pubkeyToAddress(
      {
        type: "tendermint/PubKeySecp256k1",
        value: pubKey,
      },
      hrp
    )

    return [bech32Address]
  }

  async getCosmosAddressesAndPubKeys() {
    const pubKeys = await this.getPubKeys()
    const addresses = this.getBech32Address(this.cosmosChainId,pubKeys[0])
    return { addresses, pubKeys }
  }

  async getWalletConnectGetKeyResponse(
    chainId: string,
    { name = "" }: { name?: string } = {}
  ) {
    const [pubKey] = await this.getPubKeys()
    const bech32Address = this.getBech32Address(chainId, pubKey)
    
    const uint8ArrayPubKey = Uint8Array.from(Buffer.from(pubKey, 'base64'))
    let hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(uint8ArrayPubKey)).toString()
    hash = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(hash)).toString()
    const address = Buffer.from(new Uint8Array(Buffer.from(hash, "hex"))).toString("hex")

    return {
      name,
      algo: "secp256k1",
      pubKey: Buffer.from(uint8ArrayPubKey).toString("hex"),
      address,
      bech32Address: bech32Address,
      isNanoLedger: false,
    }
  }

  async signAmino(data: any, address: string) {
    let result: any
    if (!this.cosmosProvider) throw new Error('WALLET_NOT_INITED');
    try {
      result = await this.cosmosProvider.sign(data, address)
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
    const { signatures, ...signed } = result
    return {
      signed,
      signature: signatures[0],
    }
  }

  async signDirect(payload: Uint8Array, address: string) {
    let signed
    if (!this.cosmosProvider) throw new Error('WALLET_NOT_INITED');
    try {
      signed = await this.cosmosProvider.directSign(payload, address)
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
    const getAddressesAndPubKeys = async () => {
      const result = await this.getCosmosAddressesAndPubKeys()
      return result
    }
    const sign = async (payload: Uint8Array, address: string) => {
      const result = await this.signDirect(payload, address)
      return result
    }

    return {
      async getAccounts(): Promise<readonly AccountData[]> {
        const { addresses, pubKeys } = await getAddressesAndPubKeys()

        const accounts = addresses.map((address, i) => {
          const accountData: AccountData = {
            address,
            algo: 'secp256k1',
            pubkey: Uint8Array.from(Buffer.from(pubKeys[i], 'base64')),
          }
          return accountData
        })
        return accounts
      },

      async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
        if (chainId !== signDoc.chainId) {
          throw new Error('Unmatched chain ID with Authcore signer')
        }
        const signBytes = makeSignBytes(signDoc)
        const { signatures } = await sign(signBytes, signerAddress)
        return { signature: signatures[0], signed: signDoc }
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
