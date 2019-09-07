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

export type GeneralResult = { kind: "ok" } | GeneralApiProblem
export type UserResult = { kind: "ok"; data: User } | GeneralApiProblem
export type ContentResult = { kind: "ok"; data: Content } | GeneralApiProblem

export type ContentListResult = { kind: "ok"; data: Content[] } | GeneralApiProblem
