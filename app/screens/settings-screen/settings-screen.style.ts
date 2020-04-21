import {
  StyleSheet,
  ViewStyle,
  TextStyle
} from "react-native"

import { spacing, color } from "../../theme"
import { sizes } from "../../components/text/text.sizes"

export const SettingScreenStyle = StyleSheet.create({
  Body: {
    flexGrow: 1,
    padding: spacing[4],
    paddingTop: spacing[0],
  } as ViewStyle,
  Header: {
    paddingTop: spacing[5],
    paddingBottom: spacing[7] + spacing[5],
  } as ViewStyle,
  Root: {
    flexGrow: 1,
  } as ViewStyle,
})

export const SettingScreenUserInfoStyle = StyleSheet.create({
  DisplayName: {
    color: color.palette.white,
    fontSize: 28,
    fontWeight: "500",
  } as TextStyle,
  Identity: {
    flex: 1,
    marginLeft: 12,
  } as ViewStyle,
  Root: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[5],
  } as ViewStyle,
  UserID: {
    color: color.palette.white,
    opacity: 0.6,
    fontSize: 12,
  } as TextStyle,
})

export const SettingsScreenStatsPanelStyle = StyleSheet.create({
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

export const LOGOUT: ViewStyle = {
  marginTop: spacing[4],
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
export const VERSION: TextStyle = {
  marginTop: spacing[4]
}

const TABLE_CELL_BASE: ViewStyle = {
  justifyContent: "flex-start",
  overflow: "hidden",
}
const TABLE_CELL: ViewStyle = {
  ...TABLE_CELL_BASE,
  borderStyle: "solid",
  borderTopColor: color.palette.lighterGrey,
  borderTopWidth: StyleSheet.hairlineWidth,
}
const TABLE_BORDER_RADIUS = 12
export const SETTINGS_MENU = StyleSheet.create({
  TABLE: {
    borderRadius: TABLE_BORDER_RADIUS,
    backgroundColor: color.palette.white,
    marginVertical: spacing[4],
  } as ViewStyle,
  TABLE_CELL,
  TABLE_CELL_FIRST_CHILD: {
    ...TABLE_CELL_BASE,
    borderTopLeftRadius: TABLE_BORDER_RADIUS,
    borderTopRightRadius: TABLE_BORDER_RADIUS,
  } as ViewStyle,
  TABLE_CELL_LAST_CHILD: {
    ...TABLE_CELL,
    borderBottomLeftRadius: TABLE_BORDER_RADIUS,
    borderBottomRightRadius: TABLE_BORDER_RADIUS,
  } as ViewStyle,
  TABLE_CELL_TEXT: {
    padding: spacing[2],
    paddingVertical: spacing[1],
    color: color.palette.grey4a,
    textAlign: "left",
    fontWeight: "normal",
  } as TextStyle,
})
