import {
  StyleSheet,
  ViewStyle,
  TextStyle
} from "react-native"

import { sizes } from "../../components/text/text.sizes"

import { spacing, color } from "../../theme"

export const SettingsScreenStatisticsPanelStyle = StyleSheet.create({
  Button: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing[4],
    paddingRight: spacing[2],
    paddingVertical: spacing[3] + spacing[2],
  } as ViewStyle,
  ButtonContent: {
    flexGrow: 1,
  } as ViewStyle,
  ButtonStatsDetails: {
    flexDirection: "row",
  } as ViewStyle,
  ButtonStatsDetailsLeft: {
    minWidth: 156,
  } as ViewStyle,
  ButtonStatsDetailsRight: {
    minWidth: 44,
    marginLeft: spacing[5]
  } as ViewStyle,
  ButtonStatsDetailsSubtitle: {
    color: color.palette.grey9b,
    fontSize: sizes.default,
  } as TextStyle,
  ButtonStatsDetailsTitle: {
    color: color.palette.grey4a,
    fontSize: sizes.large,
    fontWeight: "500",
  } as TextStyle,
  ButtonTitle: {
    color: color.primary,
    fontSize: sizes.small,
    fontWeight: "bold",
    marginBottom: spacing[2],
  } as TextStyle,
  ButtonUnderlaying: {
    backgroundColor: color.palette.greyf7,
  } as ViewStyle,
  Label: {
    paddingHorizontal: spacing[4],
    fontSize: sizes.small,
    color: color.palette.white,
  } as TextStyle,
  Root: {
    marginTop: -spacing[7],
  } as ViewStyle,
  Table: {
    marginTop: spacing[2],
  } as ViewStyle,
  TopSupportedCreatorAvatar: {
    marginRight: spacing[2],
  } as ViewStyle,
  TopSupportedCreatorIdentity: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
})
