import { ApisauceInstance, create, ApiResponse } from "apisauce"

import { GeneralApiProblem, getGeneralApiProblem } from "./api-problem"
import { ApiConfig, COMMON_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

export interface LikerLandUserFolloweeListResponse {
  followees: string[]
  pastFollowees: string[]
}

export type LikerLandUserFolloweeListResult = {
  kind: "ok"
  data: LikerLandUserFolloweeListResponse
} | GeneralApiProblem

export interface LikerLandUserInfoResponse {
  user: string
  email: string
  eventLastSeenTs: number
  locale: string
}

export type LikerLandUserInfoResult = {
  kind: "ok"
  data: LikerLandUserInfoResponse
}

/**
 * liker.land API.
 */
export class LikerLandAPI {
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

  async login(body: any): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post("/api/v2/users/login", body)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  async logout(): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post("/api/v2/users/logout")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  async fetchUserInfo() {
    const response: ApiResponse<LikerLandUserInfoResponse> = await this.apisauce.get("/api/v2/users/self")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok", data: response.data }
  }

  async fetchUserFolloweeList(): Promise<LikerLandUserFolloweeListResult> {
    const response: ApiResponse<LikerLandUserFolloweeListResponse> = await this.apisauce.get("/api/v2/users/followees")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok", data: response.data }
  }
}
