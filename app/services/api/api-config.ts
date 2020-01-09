import { Platform } from 'react-native'
import { APP_MARKETING_VERSION, APP_VERSION } from "react-native-dotenv"

const TIMEOUT = 10000
const USER_AGENT = `LikeCoinApp-${Platform.OS === "ios" ? 'iOS' : 'Android'} ${APP_MARKETING_VERSION} (build ${APP_VERSION})`

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number

  /**
   * The name of the user agent for requests.
   */
  userAgent: string
}

/**
 * The default configuration for like.co and liker.land API.
 */
export const COMMON_API_CONFIG: ApiConfig = {
  timeout: TIMEOUT,
  userAgent: USER_AGENT
}
