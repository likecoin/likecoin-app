import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { color, spacing } from "../../theme"

export const WalletDashboardScreenStyle = StyleSheet.create({
  BalanceContainer: {
    padding: spacing[3],
  } as ViewStyle,
  BalanceUnitLabel: {
    marginTop: spacing[2],
  } as TextStyle,
  BalanceValueText: {
    paddingHorizontal: spacing[4],
    color: color.palette.white,
    fontSize: 36,
    fontWeight: "500",
    textAlign: "center",
  } as TextStyle,
  TopNavigation: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[2],
    paddingTop: spacing[1],
  } as ViewStyle,
  UserIDLabel: {
    flexGrow: 1,
    color: color.palette.white,
    opacity: 0.6,
    fontSize: 12,
    paddingRight: 40,
  } as TextStyle,
})
