import branch from "react-native-branch"

import { logError } from "../../utils/error"

type BranchUniversalObjectProperties = {
  contentImageUrl: string
  contentMetadata: {
    customMetadata: {
      event: string
      referrer: string
    }
  }
  title?: string
  contentDescription?: string
}

export type BranchDeepLinkEventType = "app_referral"

export interface BranchDeepLinkParams {
  "~referring_link": string
  "+clicked_branch_link": boolean
  "~id": number
  "+match_guaranteed": boolean
  "+click_timestamp": number
  "~creation_source": number
  "+is_first_session": boolean
  event?: BranchDeepLinkEventType
  referrer?: string
}

type BranchDeepLinkHandler = (params: BranchDeepLinkParams) => void

export class BranchIO {
  private params: BranchDeepLinkParams

  private appReferrer: string

  private isClickedBranchLink = false

  private deepLinkHandler: BranchDeepLinkHandler = undefined

  parseAppReferralEvent(params: BranchDeepLinkParams) {
    if (params?.event === "app_referral" && params.referrer) {
      return params.referrer
    }
    return undefined
  }

  async setup() {
    branch.subscribe(this.listener)
  }

  private listener = async ({
    error,
    params,
  }: {
    error: Error
    params: BranchDeepLinkParams
  }) => {
    if (error) {
      logError(error)
      return
    }

    if (params["+non_branch_link"]) {
      // non-Branch URL if appropriate.
      return
    }

    if (!params["+clicked_branch_link"]) {
      this.isClickedBranchLink = false
      return
    }
    this.isClickedBranchLink = true
    this.params = params
    if (params.event === "app_referral") {
      this.appReferrer = this.parseAppReferralEvent(params)
    }
    if (this.deepLinkHandler) {
      try {
        this.deepLinkHandler(params)
      } catch (err) {
        logError(err)
      }
    }
  }

  setDeepLinkHandler(deepLinkHandler: BranchDeepLinkHandler) {
    this.deepLinkHandler = deepLinkHandler
  }

  setUserIdentity(userId?: string) {
    if (!userId) {
      branch.logout()
    } else {
      branch.setIdentity(userId)
    }
  }

  getBranchInstance() {
    return branch
  }

  async getAppReferrer({ latest = false } = {}) {
    if (this.appReferrer) return this.appReferrer
    const promises = [this.getLatestParams()]
    if (!latest) promises.push(this.getInstallParams())
    const [latestParams, installParams] = await Promise.all(promises)
    const referrer = this.parseAppReferralEvent(latestParams || installParams)
    return referrer
  }

  getIsClickedBranchLink() {
    return this.isClickedBranchLink
  }

  getParams() {
    return this.params
  }

  getLatestParams() {
    return branch.getLatestReferringParams()
  }

  getInstallParams() {
    return branch.getFirstReferringParams()
  }

  async generateAppReferralLink(
    userId: string,
    {
      description,
      title,
    }: {
      description?: string
      title?: string
    } = {},
  ) {
    if (!userId) return ""
    const payload: BranchUniversalObjectProperties = {
      contentImageUrl: "https://static.like.co/og/app/referral.png",
      contentMetadata: {
        customMetadata: {
          event: "app_referral",
          referrer: userId,
        },
      },
    }
    if (title) payload.title = title
    if (description) payload.contentDescription = description
    const appReferralBUO = await branch.createBranchUniversalObject(
      `app_referral/${userId}`,
      payload,
    )
    const linkProperties = {
      campaign: "App referral link",
      feature: "referral",
      channel: "app",
    }
    const controlParams = {
      /* eslint-disable @typescript-eslint/camelcase */
      $desktop_url: "https://like.co/in/getapp",
      custom_data: {
        event: "app_referral",
        referrer: userId,
      },
      /* eslint-enable @typescript-eslint/camelcase */
    }
    const { url } = await appReferralBUO.generateShortUrl(
      linkProperties,
      controlParams,
    )
    return url
  }
}
