import { ApisauceInstance, create, ApiResponse } from "apisauce"

import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, COMMON_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

const getTimezone = () => ((new Date()).getTimezoneOffset() / -60).toString()

function filterSuperLikeList(list: any) {
  const items = [] as Types.SuperLikeFeed;
  list.forEach((l: any) => {
    const { id, shortId, likee, liker, ts, url, superLikeIscnId } = l;
    try {
      // Guard malformed URI
      decodeURI(url);
      items.push({
        superLikeID: id,
        superLikeShortID: shortId,
        superLikeIscnId,
        referrer: url,
        ts,
        user: likee,
        liker,
      });
    } catch {
      // no-op
    }
  });
  return items;
}

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
          archived: 0 | 1 | ""
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
      archive: async (id: string): Promise<Types.GeneralResult> => {
        const response: ApiResponse<any> = await this.apisauce.post(
          `/users/bookmarks/${id}/archive`,
        )

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return { kind: "ok" }
      },
      unarchive: async (id: string): Promise<Types.GeneralResult> => {
        const response: ApiResponse<any> = await this.apisauce.delete(
          `/users/bookmarks/${id}/archive`,
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
    self: async ({
      id,
      url,
    }): Promise<Types.CurrentUserContentLikeStatResult> => {
      const response: ApiResponse<Types.UserContentLikeStat> =
        await this.apisauce.get(`/like/likebutton/${id}/self/like?referrer=${encodeURIComponent(url)}`)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return {
        kind: "ok",
        data: response.data,
      }
    },
    post: async ({
      id,
      url,
      count = 1,
    }: {
      id: string
      url: string
      count?: number
    }): Promise<Types.GeneralResult> => {
      const response: ApiResponse<any> =
        await this.apisauce.post(`/like/likebutton/${id}/${count}?referrer=${encodeURIComponent(url)}`)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok" }
    },
    share: {
      latest: async (
        {
          before,
          limit,
        }: {
          before?: number
          limit?: number
        } = {}
      ): Promise<Types.SuperLikeFeedResult> => {
        const response: ApiResponse<any> = await this.apisauce.get('/like/share/latest', { before, limit })

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        const data = filterSuperLikeList(response.data.list)
        data.sort((a, b) => b.ts - a.ts)

        return {
          kind: "ok",
          data,
        }
      },
      user: async ({
        likerId,
        before,
        after,
        limit,
      }: {
        likerId?: string
        before?: number
        after?: number
        limit?: number
      } = {}): Promise<Types.SuperLikeFeedResult> => {
        const response: ApiResponse<any> = await this.apisauce.get(`/like/share/user/${likerId}/latest`, { after, before, limit })

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        const data = filterSuperLikeList(response.data.list)
        data.sort((a, b) => b.ts - a.ts)

        return {
          kind: "ok",
          data,
        }
      },
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
      self: async (url: string): Promise<Types.CurrentUserContentSuperLikeStatResult> => {
        const timezone = getTimezone()
        const response: ApiResponse<Types.UserContentSuperLikeStat> =
          await this.apisauce.get(`/like/share/self?tz=${timezone}&referrer=${encodeURIComponent(url)}`)

        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }

        return {
          kind: "ok",
          data: response.data,
        }
      },
      post: async ({
        id,
        url,
      }: {
        id: string
        url: string
      }): Promise<Types.GeneralResult> => {
        const timezone = getTimezone()
        const response: ApiResponse<any> =
          await this.apisauce.post(`/like/share/${id}`, {
            referrer: url,
            tz: timezone,
          })
  
        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }
        return { kind: "ok" }
      }
    },
  }
}
