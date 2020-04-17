import crypto from "crypto"
import { AppEventsLogger } from "react-native-fbsdk"
import { logError } from "./error"
import * as Intercom from "./intercom"
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
  intercomToken: string,
  oAuthFactors: Promise<[{ service: string }]>|[{ service: string }],
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
  likerID,
  displayName,
  email,
  intercomToken,
  oAuthFactors,
  cosmosWallet,
  authCoreUserId,
  primaryPhone,
  userPIISalt,
}: UserIdPayload) {
  Intercom.registerIdentifiedUser(likerID, intercomToken)
  const services = (await oAuthFactors).map(f => f.service)
  /* eslint-disable @typescript-eslint/camelcase */
  const opt = services.reduce((accumOpt, service) => {
    if (service) accumOpt[`binded_${service.toLowerCase()}`] = true
    return accumOpt
  }, { binded_authcore: true })
  const intercomUserPayload: any = {
    name: displayName,
    custom_attributes: {
      has_liker_land_app: true,
      cosmos_wallet: cosmosWallet,
      ...opt,
    }
  }
  if (email) intercomUserPayload.email = email
  if (primaryPhone) intercomUserPayload.phone = primaryPhone
  Intercom.updateUser(intercomUserPayload)
  AppEventsLogger.setUserData({ email })
  await Promise.all([
    setSentryUser({ id: hashUserId(authCoreUserId, userPIISalt) }),
    setCrashlyticsUserId(hashUserId(authCoreUserId, userPIISalt)),
    setAnalyticsUserId(hashUserId(authCoreUserId, userPIISalt)),
  ])
  /* eslint-enable @typescript-eslint/camelcase */
}

export async function logoutAnalyticsUser() {
  Intercom.logout()
  await Promise.all([
    resetAnalyticsUser(),
    resetSentryUser(),
    resetCrashlyticsUserId(),
  ])
}

export async function logAnalyticsEvent(event: string, payload?: any) {
  try {
    /* eslint-disable @typescript-eslint/camelcase */
    const analytics = getAnalyticsInstance()
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
        })
        break
      }
      default: {
        const [char, ...chars] = event.split("")
        // cast to camel case
        const eventCamel = `App${char.toUpperCase()}${chars.join("")}`
        await analytics.logEvent(
          filterKeyLimit(eventCamel),
          filterPayloadByLimit(payload),
        )
        AppEventsLogger.logEvent(filterKeyLimit(eventCamel))
        break
      }
    }
    /* eslint-enable @typescript-eslint/camelcase */
  } catch (err) {
    logError(err)
  }
}
