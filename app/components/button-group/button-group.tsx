import * as React from "react"
import {
  StyleSheet,
  View,
  ViewStyle,
} from "react-native"

import { Button } from "../button/button"
import { ButtonProps } from "../button/button.props"

import { color, spacing } from "../../theme"

const ROOT: ViewStyle = {
  borderRadius: 12,
  borderWidth: 0,
  flexDirection: "row",
  backgroundColor: `${color.palette.likeCyan}32`,
  minHeight: 44,
}
const BUTTON: ViewStyle = {
  paddingVertical: spacing[2],
}
const SEPARATOR: ViewStyle = {
  width: 2,
  backgroundColor: color.primary,
  borderRadius: 1,
  marginVertical: 6,
}

export interface ButtonGroupButtonProps extends ButtonProps {
  /**
   * The key of React element of each button
   */
  key: string
}

export interface ButtonGroupProps {
  /**
   * List of buttons
   */
  buttons?: ButtonGroupButtonProps[]

  /**
   * The children that prepends before the buttons
   */
  prepend?: React.ReactNode,

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * Renders a group of Buttons.
 */
export function ButtonGroup(props: ButtonGroupProps) {
  const {
    prepend: prependChildren,
    buttons,
    style: rootStyle,
    ...rest
  } = props
  const children: React.ReactNode[] = []
  if (prependChildren) {
    children.push(prependChildren)
  }
  buttons.forEach((buttonProps, index) => {
    const { style, ...rest } = buttonProps
    const buttonStyle = StyleSheet.flatten([
      BUTTON,
      {
        minWidth: buttonProps.preset !== "icon" ? 80 : undefined,
      },
      style,
    ])

    // Add separator
    if (children.length > 0) {
      children.push(
        <View
          key={`${index}-sep`}
          style={SEPARATOR}
        />
      )
    }

    children.push(
      <Button
        color="white"
        preset="plain"
        weight="400"
        style={buttonStyle}
        {...rest}
      />
    )
  })

  return (
    <View
      style={[ROOT, rootStyle]}
      {...rest}
    >
      {children}
    </View>
  )
}

ButtonGroup.defaultProps = {
  buttons: []
}
