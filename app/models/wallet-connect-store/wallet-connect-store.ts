import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment, withExperimentalFeatures, withLanguageSettingsStore, withNavigationStore } from "../extensions"

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
  .extend(withExperimentalFeatures)
  .extend(withNavigationStore)
  .extend(withLanguageSettingsStore)
  .views(self => ({
    getClient(peerId: string) {
      return self.clients.find(client => client.connector.peerId === peerId)
    },
    get activeClients() {
      return self.clients.filter(client => !!client.serializedSession)
    },
    get localizedLikerLandBaseURL() {
      let baseURL = self.getConfig("LIKERLAND_URL")

      switch (self.languageSettingsStore.activeLanguageKey) {
        case "zh-Hans-CN":
        case "zh-Hant-HK":
        case "zh-Hant-TW":
          baseURL += "/zh-Hant"
          break
        case "en":
        default:
          baseURL += "/en"
      }

      return baseURL
    },
  }))
  .actions(self => ({
    handleNewSessionRequest(uri: string, opts?: { isMobile?: boolean }) {
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
    reset() {
      self.clients.replace([]);
    },
  }))
  .preProcessSnapshot((snapshot) => ({
    clients: snapshot.clients ? snapshot.clients.filter(client => !!client.serializedSession) : [],
  }))

type WalletConnectStoreType = Instance<typeof WalletConnectStoreModel>
export interface WalletConnectStore extends WalletConnectStoreType {}
type WalletConnectStoreSnapshotType = SnapshotOut<typeof WalletConnectStoreModel>
export interface WalletConnectStoreSnapshot extends WalletConnectStoreSnapshotType {}
