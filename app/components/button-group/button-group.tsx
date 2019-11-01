import * as React from "react"
import {
  View,
  ViewStyle,
} from "react-native"

import { color } from "../../theme"
import { Button } from "../button/button"
import { ButtonProps } from "../button/button.props"

const ROOT: ViewStyle = {
  borderRadius: 12,
  borderWidth: 0,
  flexDirection: "row",
  backgroundColor: `${color.palette.likeCyan}32`,
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
        {...buttonProps}
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
