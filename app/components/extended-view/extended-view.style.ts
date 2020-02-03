import {
  Dimensions,
  StyleSheet,
  ViewStyle,
} from "react-native"

export const ExtendedViewStyle = StyleSheet.create({
  ExtendView: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    height: Math.max(Dimensions.get("screen").height, Dimensions.get("screen").width),
  } as ViewStyle,
  Root: {
    position: "relative",
  } as ViewStyle,
})
