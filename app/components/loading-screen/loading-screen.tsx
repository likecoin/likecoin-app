import * as React from "react"
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native"

import {
  LoadingScreenStyle as Style,
} from "./loading-screen.style"

import { LoadingLikeCoin } from "../loading-likecoin"
import { Screen } from "../screen"
import { Text } from "../text"

import { color } from "../../theme"

export interface LoadingScreenProps {
  /**
   * An optional text to display in the bottom.
   */
  text?: string

  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * A loading screen.
 */
export function LoadingScreen(props: LoadingScreenProps) {
  const { style, tx, text, ...restProps } = props
  const rootStyle = StyleSheet.flatten([Style.Screen, style])
  return (
    <Screen
      preset="fixed"
      backgroundColor={color.primary}
      style={rootStyle}
      {...restProps}
    >
      <LoadingLikeCoin style={Style.Animation} />
      <Text
        tx={tx}
        text={text}
        size="default"
        color="lightCyan"
        align="center"
      />
    </Screen>
  )
}
