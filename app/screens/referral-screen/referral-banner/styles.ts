import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { color } from "../../../theme"

import { sizes } from "../../../components/text/text.sizes";

export const ReferralBannerStyle = StyleSheet.create({
  Arrow: {
    width: 120,
    height: 40,
  } as ViewStyle,
  ArrowWrapper: {
    marginTop: -2,
    flexDirection: "row",
    justifyContent: "center",
  } as ViewStyle,
  ContentWrapper: {
    borderRadius: 14,
    backgroundColor: color.palette.likeGreen,
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 32,
  } as ViewStyle,
  Dollars: {
    position: "absolute",
    right: 6,
    top: 0,
    width: 77,
    height: 91,
  } as ViewStyle,
  Root: {
    position: "relative",
    paddingTop: 45,
    paddingHorizontal: 20,
  } as ViewStyle,
  StripsLeft: {
    position: "absolute",
    left: 0,
    top: 45,
    marginTop: 8,
    width: 28,
    height: 27,
  } as ViewStyle,
  StripsRight: {
    position: "absolute",
    right: 0,
    bottom: 28,
    width: 36,
    height: 18,
  } as ViewStyle, 
  Text: {
    color: color.palette.white,
    fontSize: sizes["medium-large"],
    fontWeight: "600",
  } as TextStyle, 
  TextSmall: {
    marginTop: 8,
    color: color.palette.white,
    fontSize: sizes.medium,
    fontWeight: "600",
  } as TextStyle,
});
