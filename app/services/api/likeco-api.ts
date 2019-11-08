import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, LIKECO_COMMON_API_CONFIG } from "./api-config"
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
  constructor(config: ApiConfig = LIKECO_COMMON_API_CONFIG) {
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
        "User-Agent": this.config.userAgent
      },
    })
  }

  /**
   * Register a LikeCoin account
   */
  async register(params: Types.UserRegisterParams): Promise<Types.GeneralResult> {
    const formData = new FormData()
    Object.keys(params).forEach((key) => {
      if (typeof params[key] !== 'undefined') {
        formData.append(key, params[key])
      }
    })
    const response: ApiResponse<any> = await this.apisauce.post('/users/new', formData, {
      headers: {
        // FIXME: Don't hardcore
        Cookie: '_csrf=unit_test',
        'x-csrf-token': '73fb9061-W0SmQvlNKd0uKS4d2nKoZd0u7SA',
      },
    })

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
