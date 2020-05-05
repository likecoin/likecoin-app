import {
  ImageStyle,
  TextStyle,
  StyleSheet,
  ViewStyle,
} from "react-native"
import { sizes } from "../../components/text/text.sizes"

import { color, spacing } from "../../theme"

export const ValidatorScreenStyle = StyleSheet.create({
  ContentContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[5],
  } as ViewStyle,
  IdentityInner: {
    alignItems: "center",
    flexDirection: "row",
  } as ViewStyle,
  IdentityRoot: {
    flexBasis: "100%",
  } as ViewStyle,
  Link: {
    marginTop: spacing[4],
  } as ViewStyle,
  LinkWrapper: {
    flexDirection: "row",
  } as ViewStyle,
  RedelegateButton: {
    position: "relative",
  } as ViewStyle,
  RedelegateButtonIcon: {
    position: "absolute",
    margin: spacing[2],
  } as ViewStyle,
  Root: {
    flex: 1,
    backgroundColor: color.primary,
  } as ViewStyle,
  Screen: {
    flexGrow: 1,
  } as ViewStyle,
  StakingContainer: {
    alignItems: "center",
  } as ViewStyle,
  TopBar: {
    alignItems: "flex-start",
    paddingHorizontal: spacing[2],
  } as ViewStyle,
  ValidatorIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: spacing[3],
  } as ImageStyle,
  ValidatorName: {
    color: color.palette.likeCyan,
    fontSize: sizes.large,
    fontWeight: "500",
    flex: 1,
  } as TextStyle,
})
