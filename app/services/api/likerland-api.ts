import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, COMMON_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

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
        "User-Agent": this.config.userAgent
      },
    })
  }

  getSignInURL() {
    return `${this.apisauce.getBaseURL()}/users/login`
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post("/users/logout")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  /**
   * Fetch the current user info
   */
  async fetchCurrentUserInfo(opts: Types.APIOptions = {}): Promise<Types.UserResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/users/self/min")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        switch (problem.kind) {
          case "forbidden":
          case "not-found":
            if (!opts.isSlient) {
              this.config.onUnauthenticated(response.originalError)
            }
            break
        }
        return problem
      }
    }

    try {
      const data: Types.User = response.data
      return { kind: "ok", data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Follow a liker
   */
  async followLiker(likerID: string): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post(`/reader/follow/user/${likerID}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  /**
   * Unfollow a liker
   */
  async unfollowLiker(likerID: string): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.delete(`/reader/follow/user/${likerID}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  /**
   * Fetch current user's supporters
   */
  async fetchCurrentUserSupporters(): Promise<Types.SupporterListResult> {
    const response: ApiResponse<any> = await this.apisauce.get('/civic/support/self/')

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data: Types.Supporters[] = response.data.list
      return { kind: "ok", data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetch Civic Liker staking info
   */
  async fetchCivicLikerStakingInfo(): Promise<Types.CivicLikerStakingInfoResult> {
    const response: ApiResponse<Types.CivicLikerStakingInfo> = await this.apisauce.get('/civic/staking/info')

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const { operatorAddress, stakingAmountTarget } = response.data
      return {
        kind: "ok",
        data: {
          operatorAddress,
          stakingAmountTarget,
        },
      }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetch Civic Liker staking
   */
  async fetchCivicLikerStaking(): Promise<Types.CivicLikerStakingResult> {
    const response: ApiResponse<Types.CivicLikerStaking> = await this.apisauce.get('/civic/staking')

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const { status, stakingAmount } = response.data
      return {
        kind: "ok",
        data: {
          status,
          stakingAmount,
        },
      }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
