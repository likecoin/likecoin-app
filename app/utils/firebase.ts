import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'
import firebase from '@react-native-firebase/app'

if (firebase.app().utils().isRunningInTestLab) {
  analytics().setAnalyticsCollectionEnabled(false)
}

export function getAnalyticsInstance() {
  return analytics()
}

export async function setAnalyticsUserId(userId: string) {
  return analytics().setUserId(userId)
}

export async function resetAnalyticsUser() {
  return analytics().resetAnalyticsData()
}

export async function setAnalyticsCurrentScreen(currentRouteName: string) {
  return analytics().logScreenView({
    /* eslint-disable @typescript-eslint/camelcase */
    screen_class: currentRouteName,
    screen_name: currentRouteName,
    /* eslint-enable @typescript-eslint/camelcase */
  })
}

export async function setCrashlyticsUserId(userId: string) {
  return crashlytics().setUserId(userId)
}

export async function resetCrashlyticsUserId() {
  return crashlytics().setUserId("")
}
