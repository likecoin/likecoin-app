import {
  ImageStyle,
  StyleSheet,
  ViewStyle,
} from "react-native"
import { color, spacing } from "../../theme"

export const AvatarStyle = StyleSheet.create({
  GradientBase: {
    borderColor: color.transparent,
  } as ViewStyle,
  GradientLarge: {
    borderWidth: spacing[1],
    margin: spacing[1],
  } as ViewStyle,
  GradientSmall: {
    borderWidth: 2,
    margin: 2,
  } as ViewStyle,
  Halo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  } as ViewStyle,
  Image: {
    overflow: "hidden",
  } as ImageStyle,
  Root: {
    position: "relative",
  } as ViewStyle,
})
