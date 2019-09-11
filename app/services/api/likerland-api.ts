import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, LIKERLAND_API_CONFIG } from "./api-config"
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
  constructor(config: ApiConfig = LIKERLAND_API_CONFIG) {
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
   * Fetch a list of the reader suggestion
   */
  async fetchReaderSuggest(): Promise<Types.ContentListResult> {
    const response: ApiResponse<any> = await this.apisauce.get('/reader/works/suggest')

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data: Types.Content[] = response.data.list 
      return { kind: "ok", data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetch a list of content from followed authors
   */
  async fetchReaderFollowing(): Promise<Types.ContentListResult> {
    const response: ApiResponse<any> = await this.apisauce.get('/reader/works/followed')

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data: Types.Content[] = response.data.list
      return { kind: "ok", data }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
