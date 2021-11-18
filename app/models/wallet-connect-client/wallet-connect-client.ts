import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import WalletConnect from "@walletconnect/client"

import { withCurrentUser, withEnvironment, withNavigationStore } from "../extensions"
import { NavigationActions } from "react-navigation"
import { logError } from "../../utils/error"

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
        console.log("disconnect start")
        yield self.connector.killSession()
        console.log("disconnect success")
      } catch (error) {
        console.log("disconnect error", error)
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
      console.log("handleNewCallRequest", payload)
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
          case "keplr_enable_wallet_connect_v1":
            result = []
            break
  
          case "keplr_get_key_wallet_connect_v1":    
            result = [
              yield self.env.authCoreAPI.getWalletConnectGetKeyResponse(
                payload.params[0],
                { name: self.currentUser.likerID }
              ),
            ]
            break
  
          case "keplr_sign_amino_wallet_connect_v1":
            try {
              result = yield self.env.authCoreAPI.signAmino(
                payload.params[2],
                payload.params[1]
              )
            } catch (error) {
            }
            break
  
          default:
            break
        }
      } catch (error) {
        logError(error)
      }

      console.log("handleCallRequestApproval", payload, result)

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
