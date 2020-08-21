import {
  StyleSheet,
  ViewStyle,
} from "react-native"

export const Style = StyleSheet.create({
  LoadingScreen: {
    ...StyleSheet.absoluteFillObject,
  } as ViewStyle,
  Root: {
    flex: 1,
  } as ViewStyle,
  WebViewWrapper: {
    flex: 0,
    width: 0,
    height: 0,
    opacity: 0,
  } as ViewStyle,
})
