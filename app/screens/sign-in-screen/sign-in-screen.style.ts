import {
  ImageStyle,
  StyleSheet,
  ViewStyle,
} from "react-native"

import { spacing, color } from "../../theme"

export const SignInScreenStyle = StyleSheet.create({
  BgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: null,
    height: null,
    resizeMode: "cover",
  } as ImageStyle,
  BgImageWrapper: {
    position: "relative",
    flexGrow: 1,
  } as ViewStyle,
  Footer: {
    flexShrink: 0,
    alignItems: "center",
  } as ViewStyle,
  FooterContent: {
    maxWidth: 414,
    width: "100%",
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    alignItems: "stretch",
  } as ViewStyle,
  Root: {
    flex: 1,
    flexDirection: "column-reverse",
    backgroundColor: color.primary,
  } as ViewStyle,
  SignInButton: {
    marginTop: spacing[1],
    padding: spacing[2],
  } as ViewStyle,
  SignInButtonContainer: {
    position: "relative",
  } as ViewStyle,
  SignInActivityIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  } as ViewStyle,
  Slogan: {
    alignSelf: "stretch",
    aspectRatio: 244 / 94,
  } as ImageStyle,
  Version: {
    marginVertical: spacing[4],
  } as ViewStyle,
})
