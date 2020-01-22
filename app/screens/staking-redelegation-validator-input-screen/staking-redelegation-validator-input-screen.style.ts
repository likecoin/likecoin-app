import { StyleSheet, ViewStyle } from "react-native"
import { spacing } from "../../theme"

export const StakingRedelegationValidatorInputScreenStyle = StyleSheet.create({
  Header: {
    alignItems: "flex-start",
  } as ViewStyle,
  Screen: {
    flexGrow: 1,
    padding: spacing[4],
    paddingTop: spacing[0],
  } as ViewStyle,
  Sheet: {
    marginTop: spacing[5],
    padding: spacing[2],
  } as ViewStyle,
})
