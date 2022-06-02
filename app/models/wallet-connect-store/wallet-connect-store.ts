import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { NavigationActions } from "react-navigation"
import { withExperimentalFeatures, withNavigationStore } from "../extensions"

import { WalletConnectClientModel } from "../wallet-connect-client"

/**
 * Store for handling Wallet Connect
 */
export const WalletConnectStoreModel = types
  .model("WalletConnectStore")
  .props({
    clients: types.array(WalletConnectClientModel),
  })
  .extend(withExperimentalFeatures)
  .extend(withNavigationStore)
  .views(self => ({
    getClient(peerId: string) {
      return self.clients.find(client => client.connector.peerId === peerId)
    },
    get activeClients() {
      return self.clients.filter(client => !!client.serializedSession)
    },
  }))
  .actions(self => ({
    handleNewSessionRequest(uri: string, opts?: { isMobile?: boolean }) {
      // Show WalletConnect Modal for loading UX
      self.navigationStore.navigateTo({
        routeName: "App",
        action: NavigationActions.navigate({
          routeName: "WalletConnect",
        }),
      })
      const client = WalletConnectClientModel.create({})
      client.createSession(uri, opts)
      self.clients.push(client)
    },
    afterCreate() {
      if (!self.experimentalFeatures || !self.experimentalFeatures.isWalletConnectActivated) return
      self.clients.forEach(client => {
        client.restoreSession()
      })
    },
  }))
  .preProcessSnapshot((snapshot) => ({
    clients: snapshot.clients ? snapshot.clients.filter(client => !!client.serializedSession) : [],
  }))

type WalletConnectStoreType = Instance<typeof WalletConnectStoreModel>
export interface WalletConnectStore extends WalletConnectStoreType {}
type WalletConnectStoreSnapshotType = SnapshotOut<typeof WalletConnectStoreModel>
export interface WalletConnectStoreSnapshot extends WalletConnectStoreSnapshotType {}
