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
  BalanceView: {
    paddingTop: spacing[4],
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
  } as ViewStyle,
  DashboardBody: {
    flex: 1,
    marginTop: -40,
  } as ViewStyle,
  DashboardBodyWrapper: {
    flexGrow: 1,
    backgroundColor: color.palette.white,
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[6],
  } as ViewStyle,
  DashboardFooter: {
    marginTop: spacing[5],
    paddingTop: spacing[6],
    margin: spacing[5],
    borderTopColor: color.palette.grey9b,
    borderTopWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  DashboardHeader: {
    padding: spacing[3],
    paddingBottom: 64,
  } as ViewStyle,
  DashboardHeaderButtonGroupWrapper: {
    alignItems: "center",
  } as ViewStyle,
  QRCodeButton: {
    paddingHorizontal: spacing[3],
  } as ViewStyle,
  Root: {
    flex: 1,
    backgroundColor: color.palette.white,
  } as ViewStyle,
  Screen: {
    flexGrow: 1,
    alignItems: "stretch",
  } as ViewStyle,
  TopNavigation: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[2],
    paddingTop: spacing[1],
  } as ViewStyle,
  TopUnderlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    aspectRatio: 0.8,
    backgroundColor: color.primary,
  } as ViewStyle,
  UserIDLabel: {
    flexGrow: 1,
    color: color.palette.white,
    opacity: 0.6,
    fontSize: 12,
  } as TextStyle,
  ValidatorListFooter: {
    paddingTop: spacing[2],
    paddingHorizontal: spacing[4],
  } as ViewStyle,
  ValidatorListHeader: {
    alignItems: "center",
  } as ViewStyle,
  ValidatorListVerticalLine: {
    width: 2,
    height: 16,
    marginTop: spacing[2],
    backgroundColor: color.primary,
  } as ViewStyle,
  ValidatorListWrapper: {
    padding: spacing[2],
  } as ViewStyle,
  WithdrawRewardsButton: {
    paddingHorizontal: spacing[4],
  } as ViewStyle,
  WithdrawRewardsButtonWrapper: {
    alignItems: "center"
  } as ViewStyle,
})
