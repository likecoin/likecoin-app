import crypto from 'crypto'
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
  email: string,
  intercomToken: string,
  oAuthFactors: [{ service: string }],
  cosmosWallet: string,
  authCoreUserId: string,
  userPIISalt: string,
}

const VALUE_LENGTH_LIMIT = 100

function hashUserId(userId: string, salt: string) {
  const hash = crypto.createHmac('sha256', salt)
  hash.update(userId)
  const value = hash.digest('hex')
  return value
};

export async function updateAnalyticsUserId({
  likerID,
  displayName,
  email,
  intercomToken,
  oAuthFactors,
  cosmosWallet,
  authCoreUserId,
  userPIISalt,
}: UserIdPayload) {
  Intercom.registerIdentifiedUser(likerID, intercomToken)
  const services = oAuthFactors.map(f => f.service)
  /* eslint-disable @typescript-eslint/camelcase */
  const opt = services.reduce((accumOpt, service) => {
    if (service) accumOpt[`binded_${service.toLowerCase()}`] = true
    return accumOpt
  }, { binded_authcore: true })
  Intercom.updateUser({
    name: displayName,
    email,
    custom_attributes: {
      has_liker_land_app: true,
      cosmos_wallet: cosmosWallet,
      ...opt,
    }
  })
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
          item_id: itemId.substring(0, VALUE_LENGTH_LIMIT),
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
          item_id: itemId.substring(0, VALUE_LENGTH_LIMIT),
        })
        break
      }
      default: {
        const [char, ...chars] = event.split('')
        const eventCamel = `App${char[0]}${chars.join('')}`
        await analytics.logEvent(eventCamel, payload)
        break
      }
    }
    /* eslint-enable @typescript-eslint/camelcase */
  } catch (err) {
    logError(err)
  }
}
