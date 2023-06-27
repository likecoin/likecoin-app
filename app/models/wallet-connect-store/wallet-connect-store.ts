import { Instance, SnapshotOut, flow, types } from "mobx-state-tree"
import { parseUri } from '@walletconnect/utils'
import { withEnvironment, withExperimentalFeatures, withLanguageSettingsStore, withNavigationStore } from "../extensions"

import { WalletConnectClientModel } from "../wallet-connect-client"
import { WalletConnectV2ClientModel } from "../wallet-connect-v2-client"

/**
 * Store for handling Wallet Connect
 */
export const WalletConnectStoreModel = types
  .model("WalletConnectStore")
  .props({
    clients: types.array(WalletConnectClientModel),
    v2Client: types.optional(WalletConnectV2ClientModel, {}),
  })
  .extend(withEnvironment)
  .extend(withExperimentalFeatures)
  .extend(withNavigationStore)
  .extend(withLanguageSettingsStore)
  .views(self => ({
    getClient(peerId: string) {
      return self.clients.find(client => client.connector.peerId === peerId) || self.v2Client
    },
    get activeClients() {
      return [].concat(self.clients.filter(client => !!client.serializedSession), self.v2Client.getActiveClients());
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
    handleNewSessionRequest: flow(function * (uri: string, opts?: { isMobile?: boolean }) {
      // Guard duplicated requests
      if (self.clients.find(c => c.uri === uri)) return

      const { version, topic } = parseUri(uri)

      // Route the provided URI to the v1 SignClient if URI version indicates it, else use v2.
      if (version === 1) {
        const newClient = WalletConnectClientModel.create({}, self.env)
        newClient.createSession(uri, opts)

        // Deduplicate clients with same URL while adding new client
        const toBeRemovedClients = self.clients.filter(client => client.connector.clientMeta.url === newClient.connector.clientMeta.url)

        self.clients.push(newClient)

        yield Promise.all(toBeRemovedClients.map(client => {
          client.disconnect().catch()
        }))
        toBeRemovedClients.map(c => self.clients.remove(c))
      } else if (topic && topic.length === 64) {
        // valid topic is a sha256 hash of length 64
        yield self.v2Client.connect({ uri })
      }

    }),
    afterCreate() {
      if (!self.experimentalFeatures || !self.experimentalFeatures.isWalletConnectActivated) return
      self.clients.forEach(client => {
        client.restoreSession()
        // Disconnect all Wallet Connect sessions every time the app is restarted
        client.disconnect()
      })
      if (!self.v2Client?.connector) {
        // walletconnect v2 automatically (re)stores sessions via localstorage
        self.v2Client = WalletConnectV2ClientModel.create({}, self.env)
        self.v2Client.createClient();
      }
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
