import { Platform } from 'react-native'

const TIMEOUT = 10000
const USER_AGENT = `LikeCoinApp-${Platform.OS === "ios" ? 'iOS' : 'Android'}`

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
export const LIKECO_COMMON_API_CONFIG: ApiConfig = {
  timeout: TIMEOUT,
  userAgent: USER_AGENT
}
