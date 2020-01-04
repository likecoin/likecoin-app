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
   * Fetch a list of the reader suggestion
   */
  async fetchReaderFeatured(): Promise<Types.ContentListResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/reader/works/suggest")

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
  async fetchReaderFollowing({ before }: { before?: number } = {}): Promise<Types.ContentListResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/reader/works/followed", { before })

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
   * Fetch a list of bookmarked content
   */
  async fetchReaderBookmark(): Promise<Types.BookmarkListResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/reader/bookmark")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data: string[] = response.data.bookmarks
      return { kind: "ok", data }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
