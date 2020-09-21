import { sentryCaptureError } from './sentry'

export function logError(err: any) {
  if (__DEV__) {
    console.tron.error(err.message || err, null)
  } else {
    console.error(err)
    sentryCaptureError(err)
  }
}
