import {
  StyleSheet,
  ViewStyle,
} from "react-native"

export const Style = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  LoadingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  Overlay: {
    flex: 1,
    position: "relative",
  } as ViewStyle,
  Screen: {
    flex: 1,
  } as ViewStyle,
  Webview: {
    opacity: 0,
  } as ViewStyle,
})
