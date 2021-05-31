import {
  ImageStyle,
  TextStyle,
  StyleSheet,
  ViewStyle,
} from "react-native"
import { sizes } from "../../components/text/text.sizes"

import { color, spacing } from "../../theme"

const StatusBase: TextStyle = {
  paddingHorizontal: spacing[2],
  paddingVertical: 1,
  fontSize: sizes.small,
  fontWeight: "bold",
  textTransform: "uppercase",
  lineHeight: spacing[3],
  borderWidth: 1,
  borderRadius: 6,
}

export const ValidatorScreenStyle = StyleSheet.create({
  Identity: {
    flexBasis: "100%",
  } as ViewStyle,
  IdentityLayout: {
    alignItems: "stretch",
    flexDirection: "row",
  } as ViewStyle,
  IdentityRight: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flexGrow: 0,
    flexShrink: 1,
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
  StakingContainer: {
    alignItems: "center",
  } as ViewStyle,
  StatusActive: {
    ...StatusBase,
    color: color.palette.darkModeGreen,
    borderColor: color.palette.darkModeGreen,
  } as TextStyle,
  StatusInactive: {
    ...StatusBase,
    color: color.palette.orange,
    borderColor: color.palette.orange,
  } as TextStyle,
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
    flexShrink: 1,
    marginBottom: spacing[2],
  } as TextStyle,
})
