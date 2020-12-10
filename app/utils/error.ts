import { sentryCaptureError, sentryCaptureMessage } from './sentry'

export function logError(err: any) {
  if (__DEV__) {
    console.tron.error(err.message || err, null)
  } else {
    console.error(err)
    sentryCaptureError(err)
  }
}

export function logMessage(msg: string) {
  if (__DEV__) {
    console.tron.warn(msg)
  } else {
    console.warn(msg)
    sentryCaptureMessage(msg)
  }
}
