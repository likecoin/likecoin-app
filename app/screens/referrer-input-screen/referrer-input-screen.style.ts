import { ViewStyle, TextStyle, StyleSheet } from "react-native"

import { sizes } from "../../components/text/text.sizes"
import { color, spacing } from "../../theme"

const BUTTON_GROUP_WIDTH = 256

export const ReferrerInputScreenStyle = StyleSheet.create({
  BottomBar: {
    alignItems: "center",
  } as ViewStyle,
  ButtonGroup: {
    marginTop: spacing[4],
    paddingHorizontal: spacing[1],
    width: BUTTON_GROUP_WIDTH,
  } as ViewStyle,
  ConfirmButton: {
    alignSelf: "center",
    minWidth: 144,
    marginTop: spacing[4],
  } as ViewStyle,
  ContentView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  ErrorText: {
    flexGrow: 1,
  } as TextStyle,
  ErrorView: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[4],
    flexDirection: "row",
    width: BUTTON_GROUP_WIDTH,
  } as ViewStyle,
  ReferrerIDInput: {
    flex: 1,
  } as ViewStyle,
  ReferrerIDInputLabel: {
    marginBottom: spacing[2],
    color: color.palette.likeCyan,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  } as TextStyle,
  ReferrerIDInputLabelWrapper: {
    width: BUTTON_GROUP_WIDTH,
  } as ViewStyle,
  ReferrerIDInputText: {
    color: color.palette.white,
    backgroundColor: color.transparent,
    fontSize: sizes.default,
    paddingHorizontal: spacing[3],
    flex: 1,
  } as TextStyle,
  Screen: {
    flex: 1,
    padding: spacing[4],
    paddingTop: spacing[0],
    backgroundColor: color.primary,
  } as ViewStyle,
})
