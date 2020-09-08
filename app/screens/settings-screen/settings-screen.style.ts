import {
  StyleSheet,
  ViewStyle,
  TextStyle
} from "react-native"

import { spacing, color } from "../../theme"

const BODY_OVERLAP = spacing[6]

export const SettingScreenStyle = StyleSheet.create({
  Body: {
    flexGrow: 1,
    padding: spacing[4],
    paddingTop: spacing[0],
  } as ViewStyle,
  Header: {
    marginBottom: -BODY_OVERLAP,
    paddingTop: spacing[5],
    paddingBottom: BODY_OVERLAP + spacing[5],
  } as ViewStyle,
  Root: {
    flexGrow: 1,
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
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[4],
    color: color.palette.grey4a,
    textAlign: "left",
    fontWeight: "normal",
  } as TextStyle,
})
