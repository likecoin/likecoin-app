import { Platform } from 'react-native'
import {
  LIKECO_API_URL,
  LIKERLAND_API_URL,
} from 'react-native-dotenv'

const TIMEOUT = 10000
const USER_AGENT = `LikeCoinApp-${Platform.OS === "ios" ? 'iOS' : 'Android'}`

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

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
 * The default configuration for like.co API.
 */
export const LIKECO_API_CONFIG: ApiConfig = {
  url: LIKECO_API_URL,
  timeout: TIMEOUT,
  userAgent: USER_AGENT
}

/**
 * The default configuration for liker.land API.
 */
export const LIKERLAND_API_CONFIG: ApiConfig = {
  url: LIKERLAND_API_URL,
  timeout: TIMEOUT,
  userAgent: USER_AGENT
}
