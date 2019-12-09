import { GeneralApiProblem } from "./api-problem"

export interface User {
  user: string,
  displayName?: string,
  email?: string,
  avatar?: string,
  intercomToken?: string,
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
}

export interface UserRegisterParams extends UserLoginParams {
  user: string
}

export type GeneralResult = { kind: "ok" } | GeneralApiProblem
export type UserResult = { kind: "ok"; data: User } | GeneralApiProblem
export type ContentResult = { kind: "ok"; data: Content } | GeneralApiProblem
export type LikeStatResult = { kind: "ok"; data: LikeStat } | GeneralApiProblem

export type ContentListResult = { kind: "ok"; data: Content[] } | GeneralApiProblem
