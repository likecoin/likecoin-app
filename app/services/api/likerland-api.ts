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
   * Fetch the current user info
   */
  async fetchCurrentUserInfo(): Promise<Types.UserResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/users/self")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        switch (problem.kind) {
          case "forbidden":
          case "not-found":
            this.config.onUnauthenticated()
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
   * Fetch reader's users
   */
  async fetchReaderCreators(): Promise<Types.ReaderCreatorsResult> {
    const response: ApiResponse<any> = await this.apisauce.get("/reader/index")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return {
        kind: "ok",
        following: response.data.list,
        unfollowed: response.data.unfollowedUsers,
      }
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
      if (problem) {
        if (problem.kind === "forbidden") {
          this.config.onUnauthenticated()
        }
        return problem
      }
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
      if (problem) {
        if (problem.kind === "forbidden") {
          this.config.onUnauthenticated()
        }
        return problem
      }
    }

    try {
      const data: string[] = response.data.bookmarks
      return { kind: "ok", data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Bookmark a content
   */
  async addBookmark(url: string): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.post("/reader/bookmark", null, { params: { url } })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  /**
   * Remove a bookmarked content
   */
  async removeBookmark(url: string): Promise<Types.GeneralResult> {
    const response: ApiResponse<any> = await this.apisauce.delete("/reader/bookmark", null, { params: { url } })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
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
}
