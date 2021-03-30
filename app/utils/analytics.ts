import crypto from "crypto"
import { AppEventsLogger } from "react-native-fbsdk"
import { logError } from "./error"
import {
  setSentryUser,
  resetSentryUser,
} from "./sentry"
import {
  setCrashlyticsUserId,
  resetCrashlyticsUserId,
  setAnalyticsUserId,
  resetAnalyticsUser,
  getAnalyticsInstance,
} from "./firebase"

interface UserIdPayload {
  likerID: string,
  displayName: string,
  email?: string,
  primaryPhone?: string,
  cosmosWallet: string,
  authCoreUserId: string,
  userPIISalt: string,
}

const KEY_LENGTH_LIMIT = 40
const VALUE_LENGTH_LIMIT = 100

function hashUserId(userId: string, salt: string) {
  const hash = crypto.createHmac('sha256', salt)
  hash.update(userId)
  const value = hash.digest('hex')
  return value
};

function filterKeyLimit(key) {
  return key.toString().substring(0, KEY_LENGTH_LIMIT)
}

function filterPayloadByLimit(payload) {
  if (!payload || typeof payload !== 'object') return payload
  return Object.keys(payload).reduce((acc, k) => {
    const key = filterKeyLimit(k)
    let value = payload[k]
    if (typeof value === 'string') {
      value = value.substring(0, VALUE_LENGTH_LIMIT)
    }
    acc[key] = value
    return acc
  }, {})
}

export async function updateAnalyticsUser({
  email,
  authCoreUserId,
  userPIISalt,
}: UserIdPayload) {
  /* eslint-disable @typescript-eslint/camelcase */
  AppEventsLogger.setUserID(hashUserId(authCoreUserId, userPIISalt))
  AppEventsLogger.setUserData({ email })
  await Promise.all([
    setSentryUser({ id: hashUserId(authCoreUserId, userPIISalt) }),
    setCrashlyticsUserId(hashUserId(authCoreUserId, userPIISalt)),
    setAnalyticsUserId(hashUserId(authCoreUserId, userPIISalt)),
  ])
  /* eslint-enable @typescript-eslint/camelcase */
}

export async function logoutAnalyticsUser() {
  await Promise.all([
    AppEventsLogger.setUserID(null),
    resetAnalyticsUser(),
    resetSentryUser(),
    resetCrashlyticsUserId(),
  ])
}

export async function logAnalyticsEvent(event: string, payload?: any) {
  try {
    /* eslint-disable @typescript-eslint/camelcase */
    const analytics = getAnalyticsInstance()
    const [char, ...chars] = event.split("")
    // cast to camel case
    const eventCamel = `App${char.toUpperCase()}${chars.join("")}`
    switch (event) {
      case 'login':
        await analytics.logLogin({ method: '' })
        break
      case 'register':
        await analytics.logSignUp({ method: '' })
        break
      case 'select_content': {
        const {
          contentType,
          itemId,
        } = payload
        await analytics.logSelectContent({
          content_type: contentType,
          item_id: itemId.toString().substring(0, VALUE_LENGTH_LIMIT),
        })
        break
      }
      case 'share': {
        const {
          contentType,
          itemId,
        } = payload
        await analytics.logShare({
          content_type: contentType,
          item_id: itemId.toString().substring(0, VALUE_LENGTH_LIMIT),
          method: 'app',
        })
        break
      }
      default: {
        await analytics.logEvent(
          filterKeyLimit(eventCamel),
          filterPayloadByLimit(payload),
        )
        break
      }
    }
    AppEventsLogger.logEvent(filterKeyLimit(eventCamel))
    /* eslint-enable @typescript-eslint/camelcase */
  } catch (err) {
    logError(err)
  }
}
