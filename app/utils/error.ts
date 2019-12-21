import { sentryCaptureError } from './sentry'

export function logError(err: unknown) {
  if (__DEV__) {
    console.tron.error(err, null)
  } else {
    sentryCaptureError(err)
  }
}
