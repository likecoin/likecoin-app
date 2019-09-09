import { GeneralApiProblem } from "./api-problem"

export interface User {
  user: string,
  displayName?: string,
  email?: string,
  avatar?: string,
}

export type GeneralResult = { kind: "ok" } | GeneralApiProblem
export type UserResult = { kind: "ok"; data: User } | GeneralApiProblem
