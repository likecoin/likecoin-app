import crashlytics from '@react-native-firebase/crashlytics'

export async function setCrashlyticsUserId(userId) {
  return crashlytics().setUserId(userId)
}
