import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { color, spacing } from "../../theme"
import { sizes } from "../../components/text/text.sizes"

export const ReferralScreenStyle = StyleSheet.create({
  CopyButton: {
    minWidth: 144,
  } as TextStyle,
  CopyButtonWrapper: {
    alignItems: "center",
    marginVertical: spacing[3],
  } as ViewStyle,
  DescriptionLabel: {
    fontSize: sizes.default,
    marginVertical: spacing[4],
    lineHeight: sizes.default * 1.5,
  } as TextStyle,
  Graph: {
    marginHorizontal: -20,
  } as ViewStyle,
  LinkWrapper: {
    borderColor: color.palette.grey9b,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  } as ViewStyle,
  Root: {
    flex: 1,
    backgroundColor: color.primary,
  } as ViewStyle,
  ScrollView: {
    backgroundColor: color.palette.greyf7,
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
  } as ViewStyle,
  Sheet: {
    backgroundColor: color.palette.white,
  } as ViewStyle,
  SheetContent: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  } as ViewStyle,
  Title: {
    color: color.primary,
    fontSize: sizes["medium-large"],
    fontWeight: "500",
  } as TextStyle,
})
