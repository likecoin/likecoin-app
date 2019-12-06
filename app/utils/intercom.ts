import Intercom from 'react-native-intercom'

export function registerIdentifiedUser(userId: string, hash?: string) {
  if (hash) Intercom.setUserHash(hash)
  return Intercom.registerIdentifiedUser({ userId })
}

export function logout() {
  return Intercom.logout()
}

export function updateUser(payload) {
  return Intercom.updateUser(payload)
}

export function logEvent(event: string, payload) {
  return Intercom.logEvent(event, payload)
}
