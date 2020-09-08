import {
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native"
import { color, spacing } from "../../theme"

const HEADER_TEXT_COLOR = color.palette.grey9b

export const NotificationListItemStyle = StyleSheet.create({
  ChildrenWrapper: {
    marginTop: spacing[1],
  } as ViewStyle,
  Date: {
    flexShrink: 1,
    color: HEADER_TEXT_COLOR,
  } as TextStyle,
  Header: {
    flexDirection: "row",
  } as ViewStyle,
  HeaderIcon: {
    marginRight: spacing[1],
  } as ViewStyle,
  HeaderLeft: {
    flexDirection: "row",
    flexGrow: 1,
  } as ViewStyle,
  HeaderText: {
    color: HEADER_TEXT_COLOR,
  } as TextStyle,
  Layout: {
    flexDirection: "row",
  } as ViewStyle,
  LayoutLeft: {
    marginRight: spacing[3],
  } as ViewStyle,
  LayoutRight: {
    flex: 1,
  } as ViewStyle,
  Root: {
    backgroundColor: color.palette.white,
    borderRadius: 14,
  } as ViewStyle,
  Sheet: {
    paddingHorizontal: spacing[4],
  } as ViewStyle,
})
