import * as React from "react"
import { StyleSheet, ViewStyle } from "react-native"

import { Screen } from "../screen"
import { LoadingLikeCoin } from "../loading-likecoin"
import { color } from "../../theme"

const FULL: ViewStyle = {
  flex: 1,
}

export interface LoadingScreenProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * A loading screen.
 */
export function LoadingScreen(props: LoadingScreenProps) {
  const { style, ...restProps } = props
  const rootStyle = StyleSheet.flatten([FULL, style])
  return (
    <Screen
      preset="fixed"
      backgroundColor={color.primary}
      style={rootStyle}
      {...restProps}
    >
      <LoadingLikeCoin style={FULL} />
    </Screen>
  )
}
