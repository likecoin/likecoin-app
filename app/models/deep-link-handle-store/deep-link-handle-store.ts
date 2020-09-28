import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { SuperLikeMetaResult } from "../../services/api"
import { logAnalyticsEvent } from "../../utils/analytics"
import { logError } from "../../utils/error"

import {
  withContentsStore,
  withCreatorsStore,
  withCurrentUser,
  withEnvironment,
  withNavigationStore,
} from "../extensions"
import { SuperLikeModel } from "../super-like"

// eslint-disable-next-line no-useless-escape
const URL_REGEX = /^https?:\/\/?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

const BaseModel = types
  .model("DeepLinkHandleStore")
  .props({
    /**
     * HACK: Allow deep-linked Super Like model to gain identifier references to contents
     * and creators
     */
    superLike: types.maybe(SuperLikeModel),
  })
  .extend(withCreatorsStore)
  .extend(withContentsStore)
  .extend(withCurrentUser)
  .extend(withEnvironment)
  .extend(withNavigationStore)
  .actions(self => {
    /**
     * The URL of the deep link to be used later
     */
    let deferredDeepLink = ""

    /**
     * The params of the Branch deep link to be used later
     */
    let deferredBranchParams: any

    const followAppReferrer = flow(function*(likerID: string) {
      if (!likerID) return
      const liker = self.creatorsStore.createCreatorFromLikerID(likerID)
      if (!liker.isFollowing) {
        logAnalyticsEvent("DeepLinkFollowLiker", { likerID })
        const promises: Promise<void>[] = [liker.follow()]
        if (liker.checkShouldFetchDetails()) {
          promises.push(liker.fetchDetails())
        }
        yield Promise.all(promises)
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

    const handleSuperLikeID = flow(function*(id: string) {
      try {
        const response: SuperLikeMetaResult = yield self.env.likeCoinAPI.like.share.get(
          id,
        )
        if (response.kind === "ok") {
          const {
            id,
            shortId,
            liker: likerID,
            ts: timestamp,
            url: contentURL,
          } = response.data
          const liker = self.createCreatorFromLikerID(likerID)
          if (liker.checkShouldFetchDetails()) {
            liker.fetchDetails()
          }
          const content = self.createContentFromURL(contentURL)
          if (content.checkShouldFetchDetails()) {
            content.fetchDetails()
          }
          self.superLike = SuperLikeModel.create({
            id,
            shortId,
            likers: [liker.likerID],
            timestamp,
          })
          self.superLike.setContent(content)
          self.navigationStore.dispatch({
            type: "Navigation/PUSH",
            routeName: "ContentView",
            params: {
              superLike: self.superLike,
            },
          })
        }
      } catch (error) {
        logError(error)
      }
    })

    return {
      deferDeepLink(url: string) {
        deferredDeepLink = url
      },

      /**
       * Try to open a deep link
       * @param url The optional URL of the deep link, if not provided, the deferred deep link is used instead
       */
      openDeepLink: flow(function*(url: string = deferredDeepLink) {
        if (!url) return
        if (!self.env.branchIO.getIsClickedBranchLink()) {
          if (URL_REGEX.test(url)) {
            const superLikeBaseURL = `${self.getConfig("SUPERLIKE_BASE_URL")}/`
            if (url.startsWith(superLikeBaseURL)) {
              const [, superLikeID] = url.split(superLikeBaseURL)
              if (superLikeID) {
                yield handleSuperLikeID(superLikeID)
              }
            } else {
              self.navigationStore.dispatch({
                type: "Navigation/PUSH",
                routeName: "ContentView",
                params: {
                  content: self.createContentFromURL(url),
                },
              })
            }
          }
        }

        if (deferredDeepLink) {
          deferredDeepLink = undefined
        }
      }),

      openBranchDeepLink: flow(function*(params = deferredBranchParams) {
        if (!params) return

        if (!self.currentUser) {
          deferredBranchParams = params
          return
        }

        yield handleBranchDeepLink(params)

        if (deferredDeepLink) {
          deferredBranchParams = undefined
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

/**
 * Store for handling deep links.
 */
export const DeepLinkHandleStoreModel = types.snapshotProcessor(BaseModel, {
  postProcessor() {
    // Do not save state
    return {}
  },
})

type DeepLinkHandleStoreType = Instance<typeof DeepLinkHandleStoreModel>
export interface DeepLinkHandleStore extends DeepLinkHandleStoreType {}
type DeepLinkHandleStoreSnapshotType = SnapshotOut<
  typeof DeepLinkHandleStoreModel
>
export interface DeepLinkHandleStoreSnapshot
  extends DeepLinkHandleStoreSnapshotType {}
