import { Platform } from 'react-native'
import { APP_MARKETING_VERSION, APP_VERSION } from "react-native-dotenv"
import DeviceInfo from 'react-native-device-info'

const TIMEOUT = 10000
const USER_AGENT = `LikeCoinApp-${Platform.OS === "ios" ? 'iOS' : 'Android'}/${APP_MARKETING_VERSION}(${APP_VERSION})`

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

  deviceId: string

  /**
   * Handler for unauthenticated response.
   */
  onUnauthenticated?: (error: any) => void
}

/**
 * The default configuration for like.co and liker.land API.
 */
export const COMMON_API_CONFIG: ApiConfig = {
  timeout: TIMEOUT,
  userAgent: USER_AGENT,
  deviceId: DeviceInfo ? DeviceInfo.getUniqueId() : 'unknown',
  onUnauthenticated: () => {
    // do nothing
  },
}
