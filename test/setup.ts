// we always make sure 'react-native' gets included first
import "react-native"

// libraries to mock
import "./mock-async-storage"
import "./mock-i18n"
import "./mock-keychain"
import "./mock-react-native-cookies"
import "./mock-react-native-device-info"
import "./mock-react-native-encrypted-storage"
import "./mock-react-native-iap"
import "./mock-react-native-localize"
import "./mock-reactotron"
import "./mock-textinput"
import "./mock-intercom"
import "./mock-sentry"
import "./mock-firebase"

declare global {
  var __TEST__
}
