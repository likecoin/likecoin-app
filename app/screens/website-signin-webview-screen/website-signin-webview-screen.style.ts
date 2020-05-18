import {
  StyleSheet,
  ViewStyle,
} from "react-native"

import { color } from "../../theme"

export const WebsiteSignInWebviewScreenStyle = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: color.primary,
  } as ViewStyle,
  Webview: {
    flex: 1,
  } as ViewStyle,
})
