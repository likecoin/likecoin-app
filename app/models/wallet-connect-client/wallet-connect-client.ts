import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import WalletConnect from "@walletconnect/client"
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx"

import { withCurrentUser, withEnvironment, withNavigationStore } from "../extensions"
import { NavigationActions } from "react-navigation"
import { logError } from "../../utils/error"
import { DirectSignResponse } from "@cosmjs/proto-signing"

export interface WalletConnectClientMeta {
  description: string
  url: string
  icons: string[]
  name: string
}

export interface WalletConnectSession {
  connected: boolean
  accounts: string[]
  chainId: number
  bridge: string
  key: string
  clientId: string
  clientMeta: WalletConnectClientMeta | null
  peerId: string;
  peerMeta: WalletConnectClientMeta | null
  handshakeId: number
  handshakeTopic: string
}

const SESSION_METHODS = [
  "session_request",
  "wc_sessionRequest",
  "session_update",
  "wc_sessionUpdate",
]

function isSessionRequest(method: string) {
  return SESSION_METHODS.includes(method)
}

/**
 * Store for managing Wallet Connect connector
 */
export const WalletConnectClientModel = types
  .model("WalletConnectClient")
  .props({
    serializedSession: types.optional(types.string, ""),
  })
  .volatile(() => ({
    connector: undefined as WalletConnect,
  }))
  .extend(withEnvironment)
  .extend(withNavigationStore)
  .extend(withCurrentUser)
  .actions(self => ({
    connect({
      uri,
      session,
    }: {
      uri?: string
      session?: WalletConnectSession
    }) {
      self.connector = new WalletConnect({
        uri,
        clientMeta: {
          name: "LikerLand",
          description: "Liker Land App",
          url: "https://like.co",
          icons: ["https://like.co/logo.png"],
        },
        session,
      })
    },
    disconnect: flow(function * () {
      try {
        yield self.connector.killSession()
      } catch (error) {
        logError(error)
      }
    }),
  }))
  .actions(self => ({
    handleNewSessionRequest(
      error: Error | null,
      payload: any | null,
    ) {
      if (error) {
        throw error
      }

      const { peerId, peerMeta } = payload.params[0]
      self.navigationStore.navigateTo({
        routeName: "App",
        action: NavigationActions.navigate({
          routeName: "WalletConnect",
          params: {
            peerId,
            peerMeta,
            payload,
          },
        }),
      })
    },
    handleNewCallRequest(
      error: Error | null,
      payload: any | null,
    ) {
      if (error) {
        throw error
      }

      const { peerMeta, peerId } = self.connector
      self.navigationStore.navigateTo({
        routeName: "App",
        action: NavigationActions.navigate({
          routeName: "WalletConnect",
          params: {
            peerId,
            peerMeta,
            payload,
          },
        }),
      })
    },
    handleDisconnect(error: Error | null) {
      if (error) {
        throw error
      }
      self.serializedSession = ""
    },
  }))
  .actions(self => ({
    createSession(uri: string) {
      self.connect({ uri })
      self.connector.on("session_request", self.handleNewSessionRequest)
    },
    restoreSession() {
      const session: WalletConnectSession = JSON.parse(self.serializedSession)
      self.connect({ session })

      self.connector.on("call_request", self.handleNewCallRequest)
      self.connector.on("disconnect", self.handleDisconnect)
    },
    approveSession() {
      self.connector.approveSession({
        // Unfortunately, WalletConnect 1.0 cannot deliver the chain IDs in the form we want,
        // so we temporarily set the chain ID to 99999 and send it.
        // And, WalletConnect v1.0 is not suitable for handling multiple chains.
        // When the session requested, you cannot receive information from multiple chains,
        // so open a session unconditionally and manage permissions through custom requests.
        chainId: 99999,
        accounts: [],
      })
      self.connector.off("session_request")

      self.serializedSession = JSON.stringify(self.connector.session)

      self.connector.on("call_request", self.handleNewCallRequest)
      self.connector.on("disconnect", self.handleDisconnect)
    },
    rejectSession() {
      self.connector.rejectSession()
    },
    approveCallRequest(response: {
      id: number
      result: any
    }) {
      self.connector.approveRequest(response)
    },
    rejectCallRequest(response: {
      id: number
      error: any
    }) {
      self.connector.rejectRequest(response)
    },
  }))
  .actions(self => ({
    rejectRequest(payload: any) {
      if (isSessionRequest(payload.method)) {
        self.rejectSession()
      } else {
        self.rejectCallRequest({
          id: payload.id,
          error: { message: "User rejected call request" }
        })
      }
    },
  }))
  .actions(self => ({
    handleCallRequestApproval: flow(function * (payload: any) {
      let result = null
      try {
        switch (payload.method) {
          case "keplr_enable_wallet_connect_v1": {
            result = []
            break
          }
  
          case "cosmos_getAccounts":
          case "keplr_get_key_wallet_connect_v1": {
            const chainId = payload.params[0]
            result = [
              yield self.env.authCoreAPI.getWalletConnectGetKeyResponse(
                chainId,
                { name: self.currentUser.likerID }
              ),
            ]
            break
          }

          case "cosmos_signAmino":
          case "keplr_sign_amino_wallet_connect_v1": {
            try {
              result = yield self.env.authCoreAPI.signAmino(
                payload.params[2],
                payload.params[1]
              )
            } catch (error) {
              logError(error)
            }
            break
          }

          case "cosmos_signDirect": {
            try {
              const bech32Address = payload.params[0]
              const signDoc = SignDoc.fromJSON(payload.params[1])
              const res: DirectSignResponse = yield self.env.authCoreAPI.getOfflineDirectSigner().signDirect(
                bech32Address,
                signDoc
              )
              result = {
                signed: SignDoc.toJSON(res.signed),
                signature: res.signature,
              }
            } catch (error) {
              logError(error)
            }
            break
          }
  
          default:
            break
        }
      } catch (error) {
        logError(error)
      }

      if (result) {
        self.approveCallRequest({
          id: payload.id,
          result,
        })
      } else {
        self.rejectRequest(payload)
      }
    }),
  }))
  .actions(self => ({
    approveRequest: flow(function * (payload: any) {
      if (isSessionRequest(payload.method)) {
        self.approveSession()
      } else {
        yield self.handleCallRequestApproval(payload)
      }
    }),
  }))

type WalletConnectClientType = Instance<typeof WalletConnectClientModel>
export interface WalletConnectClient extends WalletConnectClientType {}
type WalletConnectClientSnapshotType = SnapshotOut<typeof WalletConnectClientModel>
export interface WalletConnectClientSnapshot extends WalletConnectClientSnapshotType {}
