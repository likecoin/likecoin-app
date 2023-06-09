import branch from "react-native-branch"

import { logError } from "../../utils/error"

export type BranchDeepLinkEventType = "app_referral" | "wallet_connect_v1"

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
  uri?: string
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

  parseWalletConnectEvent(params: BranchDeepLinkParams) {
    if (params?.event === "wallet_connect_v1" && params.uri) {
      return params.uri
    }
    return undefined
  }

  async setup() {
    branch.subscribe(this.listener as any)
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
    const referrer = this.parseAppReferralEvent((latestParams || installParams) as any)
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
}
