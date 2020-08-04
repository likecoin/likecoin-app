import { StyleSheet, ViewStyle } from "react-native"

import { color } from "../../theme"

export const WrapScrollViewShadowStyle = StyleSheet.create({
  Root: {
    position: "relative",
  } as ViewStyle,
  Shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: color.palette.grey4a,
  } as ViewStyle,
  WrappedComponent: {
    ...StyleSheet.absoluteFillObject,
  } as ViewStyle,
})
