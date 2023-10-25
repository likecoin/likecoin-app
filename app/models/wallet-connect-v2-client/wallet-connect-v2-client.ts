import { NavigationActions } from 'react-navigation'
import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree'
import SignClient from '@walletconnect/sign-client'
import { SessionTypes, SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils'
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { DirectSignResponse } from '@cosmjs/proto-signing'

import { logError } from '../../utils/error'
import { checkIsInAppBrowser } from '../../utils/wallet-connect';

import { withCurrentUser, withEnvironment, withNavigationStore } from '../extensions'

function isSessionRequest(method: string) {
  return method.includes('proposal')
}

export const WalletConnectV2ClientModel = types
  .model('WalletConnectV2Client')
  .volatile(() => ({
    connector: undefined as SignClient,
    sessions: [] as SessionTypes.Struct[],
  }))
  .extend(withEnvironment)
  .extend(withNavigationStore)
  .extend(withCurrentUser)
  .views(_ => ({
    get isInAppBrowser() {
      return false; // TODO: implement user agent checking
    },
    get version() {
      return 2;
    },
  }))
  .views(_ => ({
    shouldShowWalletConnectModal(payload: any) {
      return (
        (
          ['cosmos_getAccounts'].includes(payload.method)
        )
      )
    },
  }))
  .actions(self => ({
    disconnect: flow(function * (topic) {
      try {
        yield self.connector?.disconnect({
          topic,
          reason: getSdkError('USER_DISCONNECTED'),
        })
      } catch (error) {
        logError(error)
      }
      yield self.connector.session.delete(topic, getSdkError('USER_DISCONNECTED'));
      self.sessions = self.connector.session.getAll();
    }),
    handleDisconnect(
      requestEvent: SignClientTypes.EventArguments['session_delete']
    ) {
      self.sessions = self.connector.session.getAll();
    },
    approveCallRequest(response: {
      topic: string
      id: number
      result: any
    }) {
      return self.connector.respond({
        topic: response.topic,
        response: formatJsonRpcResult(response.id, response.result)
      })
    },
    rejectCallRequest(response: {
      id: number,
      topic: string
      error: any
    }) {
      return self.connector.respond({
        topic: response.topic,
        response: formatJsonRpcError(response.id, getSdkError('USER_REJECTED_METHODS').message)
      })
    },
    rejectSessionRequest(response: {
      id: number,
    }) {
      return self.connector.reject({
        id: response.id,
        reason: getSdkError('USER_REJECTED_METHODS')
      })
    },
  }))
  .actions(self => ({
    rejectRequest(payload: any, topic: string, error?: any) {
      if (isSessionRequest(payload.method)) {
        self.rejectSessionRequest(payload)
      } else {
        self.rejectCallRequest({
          topic,
          id: payload.id,
          error: { message: error?.message || error || 'User rejected call request' }
        })
      }
    },
  }))
  .actions(self => ({
    handleCallRequestApproval: flow(function * (payload: any, topic: string) {
      if (!Object.values(self.env).length) return

      let result = null
      try {
        switch (payload.method) {
          case 'cosmos_getAccounts': {
            const chainId = payload.chainId.replace('cosmos:', '')
            const {
              algo,
              pubKey,
              bech32Address,
            }: {
              algo: string,
              pubKey: string,
              bech32Address: string,
            } = yield self.env.authCoreAPI.getWalletConnectGetKeyResponse(
              chainId,
              { name: self.currentUser.likerID }
            )
            result = [{
              address: bech32Address,
              pubkey: Buffer.from(pubKey, 'hex').toString('base64'),
              algo,
            }]
            break
          }

          case 'cosmos_signAmino': {
            result = yield self.env.authCoreAPI.signAmino(
              payload.params.signDoc,
              payload.params.signerAddress,
            )
            break
          }

          case 'cosmos_signDirect': {
            const bech32Address = payload.params.signerAddress
            const signDoc = SignDoc.fromJSON(payload.params.signDoc)
            const res: DirectSignResponse = yield self.env.authCoreAPI.getOfflineDirectSigner().signDirect(
              bech32Address,
              signDoc
            )
            result = {
              signed: SignDoc.toJSON(res.signed),
              signature: res.signature,
            }
            break
          }

          default:
            break
        }
        if (result) {
          self.approveCallRequest({
            topic,
            id: payload.id,
            result,
          })
        } else {
          self.rejectRequest(payload, topic)
        }
      } catch (error) {
        logError(error)

        self.rejectRequest(payload ,topic, error)
      }
    }),
  }))
  .actions(self => ({
    handleNewCallRequest(
      requestEvent: SignClientTypes.EventArguments['session_request']
    ) {
      const { id, topic, params } = requestEvent
      const { request, chainId } = params
      const requestSession = self.connector.session.get(topic)
      const payload = { id, chainId, ...request };

      // Do not show request screen if the request is getting accounts and from in-app browser
      if (self.shouldShowWalletConnectModal(payload)) {
        self.handleCallRequestApproval(payload, topic)
        return
      }

      self.navigationStore.navigateTo({
        routeName: 'App',
        action: NavigationActions.navigate({
          routeName: 'WalletConnect',
          params: {
            peerId: topic,
            peerMeta: requestSession.peer.metadata,
            payload,
          },
        }),
      })
    },
  }))
  .actions(self => ({
    // restoreSession() {
    //   const session: WalletConnectSession = JSON.parse(self.serializedSession)
    //   self.connect({ session })

    //   self.listenToRequests()
    // },
    approveSessionRequest: flow(function * (proposal: SignClientTypes.EventArguments['session_proposal']) {
      // Get required proposal data
      const { id, params } = proposal
      const { requiredNamespaces, relays } = params
      const chainId = requiredNamespaces.cosmos?.chains[0];
      // TODO: remove hacky check
      // parse requiredNamespaces and check chain id and methods
      if (!chainId.includes('likecoin')) {
        yield self.connector.reject({
          id,
          reason: getSdkError('UNSUPPORTED_CHAINS')
        })
        return;
      }
      const { bech32Address }: { bech32Address: string } = yield self.env.authCoreAPI.getWalletConnectGetKeyResponse(
        chainId.replace('cosmos:', ''),
        { name: self.currentUser.likerID }
      )
      const accounts = [bech32Address].map((address) => `${chainId}:${address}`)
      yield self.connector.approve({
        id,
        relayProtocol: relays[0].protocol,
        namespaces: {
          cosmos: {
            accounts,
            methods: ['cosmos_signAmino', 'cosmos_signDirect', 'cosmos_getAccounts'],
            events: [],
            chains: [chainId],
          },
        }
      })
      self.sessions = self.connector.session.getAll();

      // self.serializedSession = JSON.stringify(self.connector.session)
    }),
  }))
  .actions(self => ({
    handleNewSessionRequest(
      proposal: SignClientTypes.EventArguments['session_proposal']
    ) {
      const payload = {
        method: 'session_proposal',
        ...proposal,
      }
      if (!checkIsInAppBrowser(proposal)) {
        // Show WalletConnect Modal for loading UX
        self.navigationStore.navigateTo({
          routeName: 'App',
          action: NavigationActions.navigate({
            routeName: 'WalletConnect',
            params: {
              peerMeta: proposal.params.proposer.metadata,
              payload,
            },
          }),
        })
      } else {
        // Approve session request directly without user's interaction
        self.approveSessionRequest(proposal)
      }

    },
  }))
  .actions(self => ({
    approveRequest: flow(function * (payload: any, topic: string) {
      if (isSessionRequest(payload.method)) {
        self.approveSessionRequest(payload)
      } else {
        yield self.handleCallRequestApproval(payload, topic)
      }
    }),
  }))
  .actions(self => ({
    listenToRequests() {
      self.connector.on('session_proposal', self.handleNewSessionRequest)
      self.connector.on('session_request', self.handleNewCallRequest)
      self.connector.on('session_delete', self.handleDisconnect)
    },
  }))
  .actions(self => ({
    createClient: flow(function * (){
      const client = yield SignClient.init({
        projectId: self.getConfig('WALLET_CONNECT_PROJECT_ID', 'd36730c770de6ccc7db8591473e97f6f'),
        metadata: {
          name: 'LikerLand',
          description: 'Liker Land App',
          url: 'https://like.co',
          icons: ['https://liker.land/logo.png'],
          redirect: {
            native: 'com.oice://wc',
            universal: '',
          },
        },
      });
      self.connector = client;
      self.sessions = self.connector.session.getAll();
      self.listenToRequests()
      return client;
    }),
  }))
  .actions(self => ({
    connect: flow(function * ({
      uri,
    }: {
      uri?: string
    }) {
      if (!self.connector) {
        self.connector = yield self.createClient();
      }
      return yield self.connector.pair({ uri })
    }),
  }))
  .views(self => ({
    getActiveClients() {
      return self.sessions.map(session => {
        return {
          connector: {
            clientId: session.topic,
            clientMeta: session.peer.metadata,
            session,
          },
          disconnect: () => {
            self.disconnect(session.topic)
          }
        };
      });
    },
  }))

type WalletConnectV2ClientType = Instance<typeof WalletConnectV2ClientModel>
export interface WalletConnectV2Client extends WalletConnectV2ClientType {}
type WalletConnectV2ClientSnapshotType = SnapshotOut<typeof WalletConnectV2ClientModel>
export interface WalletConnectV2ClientSnapshot extends WalletConnectV2ClientSnapshotType {}
