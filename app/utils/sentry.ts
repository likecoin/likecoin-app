import * as Sentry from '@sentry/react-native'

export function initSentry(dsn: string, environment: string) {
  return Sentry.init({
    dsn,
    environment,
    debug: __DEV__,
    blacklistUrls: ['debuggerWorker.js'],
  })
}

export function sentryCaptureError(err: unknown) {
  return Sentry.captureException(err)
}

export function setSentryUser(user: Sentry.User) {
  return Sentry.configureScope((scope) => {
    scope.setUser(user)
  })
}

export function resetSentryUser() {
  return Sentry.configureScope((scope) => {
    scope.setUser(null)
  })
}
