import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { logAnalyticsEvent } from "../../utils/analytics"

import {
  withContentsStore,
  withCreatorsStore,
  withCurrentUser,
  withEnvironment,
  withNavigationStore,
} from "../extensions"

// eslint-disable-next-line no-useless-escape
const URL_REGEX = /^https?:\/\/?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

/**
 * Store for handling deep links.
 */
export const DeepLinkHandleStoreModel = types
  .model("DeepLinkHandleStore")
  .props({
    /**
     * The URL of the deep link to be used later
     */
    deferredDeepLink: types.maybe(types.string),
  })
  .volatile(() => ({
    deferredBranchParams: undefined,
  }))
  .extend(withCreatorsStore)
  .extend(withContentsStore)
  .extend(withCurrentUser)
  .extend(withEnvironment)
  .extend(withNavigationStore)
  .actions(self => {
    const followAppReferrer = flow(function*(likerID: string) {
      if (!likerID) return
      const liker = self.creatorsStore.createCreatorFromLikerID(likerID)
      if (!liker.isFollowing) {
        logAnalyticsEvent("DeepLinkFollowLiker", { likerID })
        yield liker.follow()
        self.navigationStore.dispatch({
          type: "Navigation/PUSH",
          routeName: "ReferrerFollow",
          params: {
            referrer: liker,
          },
        })
      }
    })

    const handleBranchDeepLink = flow(function*(params) {
      if (params.event === "app_referral") {
        const referrer = self.env.branchIO.parseAppReferralEvent(params)
        yield followAppReferrer(referrer)
      }
    })

    return {
      deferDeepLink(url: string) {
        self.deferredDeepLink = url
      },

      /**
       * Try to open a deep link
       * @param url The optional URL of the deep link, if not provided, the deferred deep link is used instead
       */
      openDeepLink(url: string = self.deferredDeepLink) {
        if (!url) return
        if (!self.env.branchIO.getIsClickedBranchLink()) {
          if (URL_REGEX.test(url)) {
            self.navigationStore.dispatch({
              type: "Navigation/PUSH",
              routeName: "ContentView",
              params: {
                content: self.createContentFromURL(url),
              },
            })
          }
        }

        if (self.deferredDeepLink) {
          self.deferredDeepLink = undefined
        }
      },

      handleBranchDeepLink: flow(function*(params = self.deferredBranchParams) {
        if (!params) return

        if (!self.currentUser) {
          self.deferredBranchParams = params
          return
        }

        yield handleBranchDeepLink(params)

        if (self.deferredDeepLink) {
          self.deferredBranchParams = undefined
        }
      }),

      handleAppReferrer: flow(function*() {
        const referrer = yield self.env.branchIO.getAppReferrer({
          latest: true,
        })
        yield followAppReferrer(referrer)
      }),
    }
  })

type DeepLinkHandleStoreType = Instance<typeof DeepLinkHandleStoreModel>
export interface DeepLinkHandleStore extends DeepLinkHandleStoreType {}
type DeepLinkHandleStoreSnapshotType = SnapshotOut<
  typeof DeepLinkHandleStoreModel
>
export interface DeepLinkHandleStoreSnapshot
  extends DeepLinkHandleStoreSnapshotType {}
