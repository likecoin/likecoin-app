import { ApisauceInstance, create, ApiResponse } from "apisauce"

import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, COMMON_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

/**
 * LikeCoin API.
 */
export class LikeCoinAPI {
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
        "X-Device-Id": this.config.deviceId,
      },
    })
  }

  users = {
    bookmarks: {
      get: async (
        opts: {
          archived: 0 | 1
          before?: number
          after?: number
          limit?: number
        } = {
          archived: 0,
        },
      ): Promise<Types.BookmarksResult> => {
        const response: ApiResponse<{
          list?: Types.BookmarkResult[]
        }> = await this.apisauce.get("/users/bookmarks", opts)

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return {
          kind: "ok",
          data: response.data?.list || [],
        }
      },
      add: async (url: string): Promise<Types.BookmarkAddResult> => {
        const response: ApiResponse<{
          id: string
        }> = await this.apisauce.post("/users/bookmarks", undefined, {
          params: { url },
        })

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return {
          kind: "ok",
          data: response.data.id,
        }
      },
      remove: async (url: string): Promise<Types.GeneralResult> => {
        const response: ApiResponse<any> = await this.apisauce.delete(
          "/users/bookmarks",
          undefined,
          { params: { url } },
        )

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return { kind: "ok" }
      },
    },
    notifications: {
      get: async (
        opts: {
          before?: number
          after?: number
          limit?: number
        } = {},
      ): Promise<Types.NotificationsResult> => {
        const response: ApiResponse<{
          list?: Types.NotificationResult[]
        }> = await this.apisauce.get("/users/notifications", opts)

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return {
          kind: "ok",
          data: response.data?.list || [],
        }
      },
      read: async (id: string): Promise<Types.GeneralResult> => {
        const response: ApiResponse<any> = await this.apisauce.post(
          `/users/notifications/${id}/read`,
        )

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return { kind: "ok" }
      },
      readAll: async (before: number): Promise<Types.GeneralResult> => {
        const response: ApiResponse<any> = await this.apisauce.post(
          `/users/notifications/read`,
          undefined,
          { params: { before } },
        )

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return { kind: "ok" }
      },
      delete: async (id: string): Promise<Types.GeneralResult> => {
        const response: ApiResponse<any> = await this.apisauce.delete(
          `/users/notifications/${id}`,
        )

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return { kind: "ok" }
      },
    },
  }

  like = {
    share: {
      get: async (id: string): Promise<Types.SuperLikeMetaResult> => {
        const response: ApiResponse<Types.SuperLikeMeta> = await this.apisauce.get(`/like/share/${id}`)

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return {
          kind: "ok",
          data: response.data,
        }
      },
    },
  }
}
