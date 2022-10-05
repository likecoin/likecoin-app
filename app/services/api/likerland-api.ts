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
}
