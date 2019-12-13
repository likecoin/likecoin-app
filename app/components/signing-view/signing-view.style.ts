import {
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { sizes } from "../text/text.sizes"

import { color, spacing } from "../../theme"

export const SHEET = StyleSheet.create({
  ROOT: {
    alignItems: "stretch",
    width: 256,
  } as ViewStyle,
  SECTION: {
    padding: spacing[2],
  } as ViewStyle,
})

export const SUMMARY = StyleSheet.create({
  AMOUNT: {
    marginTop: spacing[2],
  },
  BODY: {
    marginHorizontal: spacing[4],
    paddingBottom: spacing[4],
    paddingTop: spacing[2],
  },
  GRAPH: {
    height: 56,
    width: 68,
  },
  HEADER: {
    alignItems: "center",
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomColor: color.palette.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  HEADER_TITLE: {
    marginTop: spacing[3],
  } as TextStyle,
  TARGET: {
    marginTop: spacing[4],
  } as ViewStyle,
  TARGET_AVATAR: {
    width: 32,
    aspectRatio: 1,
    borderRadius: 6,
    marginRight: spacing[2],
  } as ImageStyle,
  TARGET_NAME: {
    flex: 1,
  },
  TARGET_WITH_AVATAR: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing[1],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 12,
    borderColor: color.palette.grey9b,
    borderWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
})

export const DETAIL = StyleSheet.create({
  BODY: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[5],
  } as ViewStyle,
  CONTAINER: {
    backgroundColor: color.palette.lightCyan,
  } as ViewStyle,
  HEADER: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: spacing[4],
    paddingRight: spacing[3],
  } as ViewStyle,
  ITEM: {
    marginTop: spacing[2],
  } as ViewStyle,
})

export default StyleSheet.create({
  BLOCK_EXPLORER_BUTTON: {
    marginTop: spacing[4],
    minWidth: SHEET.ROOT.width,
  },
  BODY: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  BOTTOM_NAVIGATION: {
    alignItems: "stretch",
    padding: spacing[4],
  } as ViewStyle,
  COMPLETED_LABEL: {
    marginVertical: spacing[4],
  } as TextStyle,
  ERROR: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  } as ViewStyle,
  LABEL: {
    color: color.palette.grey9b,
    fontSize: sizes.default,
    paddingVertical: spacing[1],
  },
  SCREEN: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
  } as ViewStyle,
  TOP_NAVIGATION: {
    alignItems: "flex-start",
  } as ViewStyle,
})
