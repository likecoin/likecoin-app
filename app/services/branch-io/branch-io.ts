import branch from "react-native-branch"

export class BranchIO {
  /**
   * The config object
   */
  private params: any

  private appReferrer: string

  private handleAppReferrerEvent(params: any) {
    if (!params) return undefined
    if (params.event === "app_referral" && params.referrer) {
      if (params.referrer) {
        this.appReferrer = params.referrer
        return this.appReferrer
      }
    }
    return undefined
  }

  async setup() {
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.error("Error from Branch: " + error)
        return
      }
      this.params = params
      this.handleAppReferrerEvent(params)
    })
  }

  getBranchInstance() {
    return branch
  }

  async getAppReferrer() {
    if (this.appReferrer) return this.appReferrer
    const params = await this.getLatestParams()
    const referrer = await this.handleAppReferrerEvent(params)
    return referrer
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

  async generateAppReferralLink(userId: string) {
    if (!userId) return ''
    const appReferralBUO = await branch.createBranchUniversalObject(
      `app_referral/${userId}`, {
        contentMetadata: {
          customMetadata: {
            event: "app_referral",
            referrer: userId,
          }
        }
      }
    )
    const linkProperties = {
      feature: "share",
      channel: "referral",
    }
    const controlParams = {
      /* eslint-disable @typescript-eslint/camelcase */
      $desktop_url: "https://like.co/in/getapp",
      custom_data: {
        event: "app_referral",
        referrer: userId
      }
      /* eslint-enable @typescript-eslint/camelcase */
    }
    const { url } = await appReferralBUO.generateShortUrl(linkProperties, controlParams)
    return url
  }
}
