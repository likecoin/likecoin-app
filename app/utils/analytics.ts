import crypto from 'crypto'
import * as Intercom from "./intercom"
import { setSentryUser } from "./sentry"
import {
  setCrashlyticsUserId,
  setAnalyticsUserId,
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
