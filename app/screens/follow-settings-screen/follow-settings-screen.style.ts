import {
  StyleSheet,
  TextStyle,
  ViewStyle,
  Dimensions,
} from "react-native"

import { color, spacing } from "../../theme"

const CORNER_RADIUS = 8
const MARGIN = spacing[3]

export const FollowSettingsScreenStyle = StyleSheet.create({
  Avatar: {
    marginRight: spacing[2],
  } as ViewStyle,
  List: {
    paddingHorizontal: MARGIN,
    flexGrow: 1,
    backgroundColor: color.palette.greyf2,
  } as ViewStyle,
  ListFooter: {
    height: CORNER_RADIUS * 2,
    backgroundColor: color.palette.white,
    borderBottomLeftRadius: CORNER_RADIUS,
    borderBottomRightRadius: CORNER_RADIUS,
    marginBottom: MARGIN,
  } as ViewStyle,
  ListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[2],
    backgroundColor: color.palette.white,
    borderTopColor: color.palette.grey9b,
    borderTopWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  ListItemLeft: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  Root: {
    flex: 1,
    backgroundColor: color.primary,
  } as ViewStyle,
  TabHeader: {
    marginTop: MARGIN,
    flexDirection: "row",
    backgroundColor: color.primary,
    borderTopLeftRadius: CORNER_RADIUS,
    borderTopRightRadius: CORNER_RADIUS,
  } as ViewStyle,
  TabHeaderButton: {
    width: (Dimensions.get("window").width - MARGIN * 2) / 2,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  } as ViewStyle,
  TabHeaderButtonActive: {
    borderBottomColor: color.palette.likeCyan,
    borderBottomWidth: 2,
  } as ViewStyle,
  TabHeaderButtonTitle: {
    textAlign: "center",
  } as TextStyle,
})
