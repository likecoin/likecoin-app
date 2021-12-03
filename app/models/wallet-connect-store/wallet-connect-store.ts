import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withExperimentalFeatures } from "../extensions"

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
      client.createSession(uri)
      self.clients.push(client)
    },
    afterCreate() {
      if (!self.experimentalFeatures || !self.experimentalFeatures.isWalletConnectEnabled) return
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
