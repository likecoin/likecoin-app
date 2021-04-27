import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, COMMON_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

import { getTimeZoneOffset } from "../../utils/date"

/**
 * like.co API.
 */
export class LikeCoAPI {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = COMMON_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup(url: string) {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "User-Agent": this.config.userAgent,
        "X-Device-Id": this.config.deviceId
      },
    })
  }

  /**
   * Register a LikeCoin account
   */
  async register(body: Types.UserRegisterParams): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post('/users/new', body)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  /**
   * Login to LikeCoin
   */
  async login(body: Types.UserLoginParams): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post('/users/login', body)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  /**
   * Logout from LikeCoin
   */
  async logout(): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post('/users/logout')

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  /**
   * Fetch current user info
   */
  async fetchCurrentUserInfo(): Promise<Types.UserResult> {
    const response: ApiResponse<any> = await this.apisauce.get('/users/self')

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        if (problem.kind === "forbidden") {
          this.config.onUnauthenticated(response.originalError)
        }
        return problem
      }
    }

    try {
      const user: Types.User = response.data
      return { kind: "ok", data: user }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetch content info
   */
  async fetchContentInfo(url: string): Promise<Types.ContentResult> {
    const response: ApiResponse<any> = await this.apisauce.get('/like/info', { url })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data: Types.Content = response.data
      return { kind: "ok", data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetch like stat of a content
   */
  async fetchContentLikeStat(likerId: string, url: string): Promise<Types.LikeStatResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/like/likebutton/${likerId}/total`, {
      referrer: url,
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data: Types.LikeStat = response.data
      return { kind: "ok", data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetch user info by Liker ID
   */
  async fetchUserInfoById(likerId: string): Promise<Types.UserResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/users/id/${likerId}/min`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const user: Types.User = response.data
      return { kind: "ok", data: user }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetch user info by wallet address
   */
  async fetchUserInfoByWalletAddress(address: string): Promise<Types.UserResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/users/addr/${address}/min`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const user: Types.User = response.data
      return { kind: "ok", data: user }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async fetchSupportedStatistics(
    startTs: number,
    endTs: number
  ): Promise<Types.StatisticsSupportedResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/like/info/dist/civicliker/details", {
      after: startTs,
      before: endTs,
      tz: getTimeZoneOffset(),
      format: "week"
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: "ok", data: response.data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async fetchRewardedStatistics(
    startTs: number,
    endTs: number
  ): Promise<Types.StatisticsRewardedResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/like/info/dist/writer/details", {
      after: startTs,
      before: endTs,
      tz: getTimeZoneOffset(),
      format: "week"
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: "ok", data: response.data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async fetchRewardedStatisticsSummary(
    startTs: number,
    endTs: number
  ): Promise<Types.StatisticsRewardedSummaryResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/like/info/dist/writer/total", {
      after: startTs,
      before: endTs,
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: "ok", data: response.data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async fetchTopSupportedCreators(): Promise<Types.StatisticsTopSupportedCreatorsResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/like/suggest/id")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: "ok", data: response.data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async fetchUserAppMeta(): Promise<Types.UserAppMetaResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/app/meta`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: "ok", data: response.data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async addUserAppReferrer(likerID: string): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post(
      `/app/meta/referral`,
      { referrer: likerID },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  async getMySuperLikeStatus(timezone: string, options: {
    url?: string
  } = {}): Promise<Types.SuperLikeStatusResult> {
    const response: ApiResponse<any> = await this.apisauce.get(
      '/like/share/self',
      {
        tz: timezone,
        referrer: options.url,
      }
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return {
        kind: "ok",
        data: response.data,
      }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
