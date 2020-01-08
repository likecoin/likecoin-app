import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'

export async function setAnalyticsUserId(userId: string) {
  return analytics().setUserId(userId)
}

export async function setAnalyticsCurrentScreen(currentRouteName: string) {
  return analytics().setCurrentScreen(currentRouteName, currentRouteName)
}

export async function setCrashlyticsUserId(userId: string) {
  return crashlytics().setUserId(userId)
}
