import _APP_CONFIG from "./app-config.keys"

export const APP_CONFIG = _APP_CONFIG

export type AppConfigKey = keyof typeof APP_CONFIG

export interface IntroContentListItem {
  superLikeID: string
  superLikeShortID?: string
  user?: string
  liker?: string
  referrer?: string
}

export type IntroContentList = IntroContentListItem[]
