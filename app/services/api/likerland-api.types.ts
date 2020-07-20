import { Content } from "./api.types"
import { GeneralApiProblem } from "./api-problem"

export interface SuperLikeFeedItem extends Content {
  superLikeID: string
  liker?: string
}

export type SuperLikeFeed = SuperLikeFeedItem[]

export type SuperLikeFeedResult = {
  kind: "ok"
  data: SuperLikeFeed
} | GeneralApiProblem
