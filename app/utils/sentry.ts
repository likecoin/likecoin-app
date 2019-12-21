import * as Sentry from '@sentry/react-native'

export function initSentry(dsn: string) {
  return Sentry.init({ dsn })
}

export function setSentryUser(user) {
  return Sentry.configureScope((scope) => {
    scope.setUser(user)
  })
}
