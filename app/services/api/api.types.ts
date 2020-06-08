import { GeneralApiProblem } from "./api-problem"

export interface User {
  user: string
  displayName?: string
  email?: string
  avatar?: string
  cosmosWallet?: string
  isSubscribedCivicLiker?: boolean
}

export interface Content {
  url?: string,
  referrer?: string,
  user?: string,
  title?: string,
  description?: string,
  image?: string,
  like?: number,
  ts?: number,
}

export interface LikeStat {
  total: number,
  totalLiker: number,
}

export interface UserLoginParams {
  platform: string
  accessToken: string
  firebaseIdToken?: string
  idToken?: string
  username?: string
  email?: string
  displayName?: string
  appReferrer?: string
}

export interface UserRegisterParams extends UserLoginParams {
  user: string
}

export type GeneralResult = { kind: "ok" } | GeneralApiProblem
export type UserResult = { kind: "ok"; data: User } | GeneralApiProblem
export type ContentResult = { kind: "ok"; data: Content } | GeneralApiProblem
export type LikeStatResult = { kind: "ok"; data: LikeStat } | GeneralApiProblem

export type ReaderCreatorsResult = { kind: "ok"; following: string[], unfollowed: string[] } | GeneralApiProblem
export type ContentListResult = { kind: "ok"; data: Content[] } | GeneralApiProblem
export type BookmarkListResult = { kind: "ok"; data: string[] } | GeneralApiProblem

export interface StatisticsSupportedCreatorResult {
  likee: string
  workCount: number
  LIKE: number
  likeCount: number
}
export interface StatisticsSupportedWorkResult {
  likee: string
  sourceURL: string
  LIKE: number
  likeCount: number
}
export type StatisticsSupportedResult = {
  kind: "ok"
  data: {
    workCount: number
    LIKE: number
    likeCount: number
    all: StatisticsSupportedCreatorResult[],
    daily: StatisticsSupportedWorkResult[][],
  }
} | GeneralApiProblem

export interface StatisticsRewardedContentResult {
  sourceURL: string
  LIKE: number
}

export interface StatisticsRewardedContentDetailsResult {
  sourceURL: string
  LIKE: number
  LIKEDetails: {
    basic: number
    civic: number
  }
  likeCount: number
  likerCount: {
    basic: number
    civic: number
  }
}

export type StatisticsRewardedResult = {
  kind: "ok"
  data: {
    all: StatisticsRewardedContentResult[],
    daily: StatisticsRewardedContentDetailsResult[][],
  }
} | GeneralApiProblem

export type StatisticsRewardedSummaryResult = {
  kind: "ok"
  data: {
    LIKE: {
      CreatorsFunds: number
      CivicLiker: number
    },
    likeCount: {
      civic: number
      basic: number
    },
    likerCount: {
      civic: number
      basic: number
    }
  }
} | GeneralApiProblem

export type StatisticsTopSupportedCreatorsResult = {
  kind: "ok"
  data: {
    ids: string[]
  }
} | GeneralApiProblem

export type UserAppMetaResult = {
  kind: "ok"
  data: {
    isNew: boolean
    isEmailVerified?: boolean
    ts?: number
    android?: boolean
    ios?: boolean
  }

} | GeneralApiProblem
