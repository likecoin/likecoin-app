import { GeneralApiProblem } from "./api-problem"

export interface User {
  user: string,
  displayName?: string,
  email?: string,
  avatar?: string,
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
  platform: String
  accessToken: String
  firebaseIdToken?: String
  idToken?: String
  username?: String
  email?: String
  displayName?: String
}

export type GeneralResult = { kind: "ok" } | GeneralApiProblem
export type UserResult = { kind: "ok"; data: User } | GeneralApiProblem
export type ContentResult = { kind: "ok"; data: Content } | GeneralApiProblem
export type LikeStatResult = { kind: "ok"; data: LikeStat } | GeneralApiProblem

export type ContentListResult = { kind: "ok"; data: Content[] } | GeneralApiProblem
