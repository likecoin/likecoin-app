import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { withCurrentUser, withEnvironment, withNavigationStore } from "../extensions"
import { WalletConnectClientModel } from "../wallet-connect-client"

/**
 * Store for handling Wallet Connect
 */
export const WalletConnectStoreModel = types
  .model("WalletConnectStore")
  .props({
    clients: types.array(WalletConnectClientModel),
  })
  .extend(withEnvironment)
  .extend(withNavigationStore)
  .extend(withCurrentUser)
  .views(self => ({
    getClient(peerId: string) {
      return self.clients.find(client => client.connector.peerId === peerId)
    },
    get activeClients() {
      return self.clients.filter(client => !!client.serializedSession)
    },
  }))
  .actions(self => ({
    handleNewSessionRequest(uri: string) {
      const client = WalletConnectClientModel.create({})
      self.clients.push(client)
      client.createSession(uri)
    },
    afterCreate() {
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
