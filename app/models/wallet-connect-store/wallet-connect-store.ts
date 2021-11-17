import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import WalletConnect from "@walletconnect/client"

import { withNavigationStore } from "../extensions"
import { NavigationActions } from "react-navigation"

/**
 * Store for handling Wallet Connect
 */
export const WalletConnectStoreModel = types
  .model("WalletConnectStore")
  .extend(withNavigationStore)
  .extend(self => {
    let connectors: WalletConnect[] = []

    function subscribeToEvent(connector: WalletConnect) {
      connector.on("call_request", (error: any, payload: any) => {
        if (error) {
          throw error
        }
  
        const { peerMeta, peerId } = connector

        console.tron.log("on call_request", "error", error, "payload", payload)
    
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
      })
    
      connector.on("disconnect", (error: any) => {
        if (error) {
          throw error
        }
        // const updatedConnectors = connectors.filter(
        //   (connector: WalletConnect) => {
        //     if (connector.peerId === peerId) {
        //       // TODO: Delete connector.session
        //       return false
        //     }
        //     return true
        //   }
        // )
        // connectors = updatedConnectors
      })
    }

    return {
      actions: {
        handleSessionRequest(uri: string) {
          const connector = new WalletConnect({
            uri,
            clientMeta: {
              name: "LikerLand",
              description: "Liker Land App",
              url: "https://like.co",
              icons: ["https://like.co/logo.png"],
            },
          })
          connectors.push(connector)

          console.tron.log("walletConnectStore handleSessionRequest", uri, connector)

          connector.on("session_request", (error: any, payload: any) => {

            console.tron.log("walletConnectStore on.session_request", payload, error)
            if (error) {
              throw error;
            }

            const { peerId, peerMeta } = payload.params[0];

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
          })
        },

        approveSessionRequest(
          peerId: string,
          response: { accounts: string[]; chainId: number }
        ) {

          const connector = connectors.find(
            (connector: WalletConnect) => connector.peerId === peerId
          )
          if (!connector) return

          connector.approveSession(response)

          connector.off("session_request")
          console.tron.log('walletConnectStore approveSessionRequest', "connectors", connectors)
          subscribeToEvent(connector)
        },

        rejectSessionRequest(peerId: string) {
          const connector = connectors.find(
            (connector: WalletConnect) => connector.peerId === peerId
          )

          connector.rejectSession()
        },

        killSession(peerId: string) {
          connectors = connectors.filter(
            (connector: WalletConnect) => {
              if (connector.peerId === peerId) {
                connector.killSession()
                // TODO: Delete connector.session
                return false
              }
              return true
            }
          )
        },

        approveCallRequest: flow(
          function * (
            payload: any,
            peerId: string,
            response: { id: number; result: any }
          ) {
            const connector = connectors.find(
              (connector: WalletConnect) => connector.peerId === peerId
            )          
            console.tron.log("walletConnectStore approveCallRequest approveRequest", connector, peerId, response)
            connector.approveRequest(response)
            console.tron.log("walletConnectStore approveCallRequest approveRequest done")
          }
        ),

        rejectCallRequest: flow(
          function * (
            peerId: string,
            response: { id: number; error: any }
          ) {
            const connector = connectors.find(
              (connector: WalletConnect) => connector.peerId === peerId
            )

            console.tron.log("walletConnectStore rejectRequest", connector, peerId, response)

            connector.rejectRequest(response)
          }
        ),
      }
    }
  })

type WalletConnectStoreType = Instance<typeof WalletConnectStoreModel>
export interface WalletConnectStore extends WalletConnectStoreType {}
type WalletConnectStoreSnapshotType = SnapshotOut<typeof WalletConnectStoreModel>
export interface WalletConnectStoreSnapshot extends WalletConnectStoreSnapshotType {}
