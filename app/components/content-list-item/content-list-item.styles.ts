import {
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native"

import { sizes } from "../text/text.sizes"
import { spacing } from "../../theme"

export default {
  ROOT: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
  } as ViewStyle,
  ROW: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  FOOTER: {
    marginTop: spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as ViewStyle,
  DETAIL_VIEW: {
    flex: 1,
  } as ViewStyle,
  DETAIL_TEXT: {
    marginTop: spacing[1],
    lineHeight: sizes.medium * 1.5,
  } as TextStyle,
  IMAGE_WRAPPER: {
    position: "relative",
    minWidth: 24,
  } as ViewStyle,
  IMAGE_VIEW: {
    flex: 0,
    width: 64,
    marginLeft: spacing[4],
    aspectRatio: 1,
    resizeMode: "cover",
  } as ImageStyle,
  BOOKMARK_FLAG: {
    position: "absolute",
    top: -68,
    right: 0,
  } as ViewStyle,
}
