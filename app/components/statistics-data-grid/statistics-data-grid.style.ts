import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { sizes } from "../text/text.sizes"
import { color, spacing } from "../../theme"

const TextColorNormal = color.palette.likeCyan
const TextColorHighlighted = color.palette.white
const ItemBase: ViewStyle = {
  marginBottom: spacing[2],
}
const ItemTitleBase: TextStyle = {
  fontSize: sizes.large,
  fontWeight: "500",
  lineHeight: 30,
}
const ItemValueBase: TextStyle = {
  fontSize: sizes.default,
  fontWeight: "500",
}
const ItemTitleSmallBase: TextStyle = {
  fontSize: sizes.small,
  fontWeight: "bold",
  textTransform: "uppercase",
}

export const StatisticsDataGridStyle = StyleSheet.create({
  ItemBlock: {
    ...ItemBase,
    width: "100%",
  } as ViewStyle,
  ItemLeft: {
    ...ItemBase,
  } as ViewStyle,
  ItemRight: {
    ...ItemBase,
    alignItems: "flex-end",
  } as ViewStyle,
  ItemSubtitle: {
    color: color.palette.greyBlue,
    fontSize: sizes.small,
  } as TextStyle,
  ItemTitleLarge: {
    ...ItemTitleBase,
    color: TextColorNormal,
  } as TextStyle,
  ItemTitleLargeHighlighted: {
    ...ItemTitleBase,
    color: TextColorHighlighted,
  } as TextStyle,
  ItemTitleSmall: {
    ...ItemTitleSmallBase,
    color: TextColorNormal,
  } as TextStyle,
  ItemTitleSmallHighlighted: {
    ...ItemTitleSmallBase,
    color: TextColorHighlighted,
  } as TextStyle,
  ItemTitleValueDecrease: {
    ...ItemValueBase,
    color: color.palette.angry,
  } as TextStyle,
  ItemTitleValueIncrease: {
    ...ItemValueBase,
    color: color.palette.darkModeGreen,
  } as TextStyle,
  Root: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  } as ViewStyle,
})
