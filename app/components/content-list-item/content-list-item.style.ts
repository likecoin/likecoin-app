import {
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { sizes } from "../text/text.sizes"
import { spacing, color } from "../../theme"

export const ContentListItemStyle = StyleSheet.create({
  BOOKMARK_FLAG: {
    position: "absolute",
    top: -spacing[1],
    right: spacing[0],
    width: 32,
    height: 32,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  } as ViewStyle,
  BOTTOM_BUTTON_CONTAINER: {
    flexDirection: "row",
  } as ViewStyle,
  DETAIL_TEXT: {
    marginTop: spacing[1],
    lineHeight: sizes.medium * 1.5,
  } as TextStyle,
  DETAIL_VIEW: {
    flex: 1,
  } as ViewStyle,
  FOOTER: {
    marginTop: spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as ViewStyle,
  IMAGE_VIEW: {
    flex: 0,
    width: 64,
    marginLeft: spacing[4],
    aspectRatio: 1,
    resizeMode: "cover",
  } as ImageStyle,
  MORE_BUTTON: {
    marginRight: -10,
  } as ViewStyle,
  ROW: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  Root: {
    position: "relative",
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    backgroundColor: color.palette.white,
  } as ViewStyle,
  RootUndo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[5],
    backgroundColor: color.palette.greyf7,
  } as ViewStyle,
  Underlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.palette.grey4a,
  } as ViewStyle,
  UndoButton: {
    flexShrink: 0,
    marginLeft: spacing[2],
    paddingHorizontal: 0,
  } as ViewStyle,
  UndoButtonIcon: {
    marginLeft: 0,
  } as ViewStyle,
  UndoTextWrapper: {
    flexShrink: 1,
    flexGrow: 1,
    overflow: "hidden",
  } as ViewStyle,
})
