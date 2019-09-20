import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, LIKECO_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

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
  constructor(config: ApiConfig = LIKECO_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "User-Agent": this.config.userAgent
      },
    })
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
}
