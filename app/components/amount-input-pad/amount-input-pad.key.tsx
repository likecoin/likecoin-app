import * as React from "react"
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  GestureResponderEvent,
} from "react-native"
import { mergeAll, flatten } from "ramda"

import { Text } from "../../components/text"
import { color } from "../../theme"

const STYLE = StyleSheet.create({
  ROOT: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 56/44,
    borderRadius: 14,
  } as ViewStyle,
  VALUE: {
    color: color.palette.likeGreen,
    fontSize: 20,
    fontWeight: "bold",
  } as TextStyle,
})

export interface AmountInputPadKeyProps extends TouchableOpacityProps {
  /**
   * The children of the component, useful for icon
   */
  children?: React.ReactNode,

  /**
   * The value of the key
   */
  value?: string

  /**
   * The callback function when the key is clicked
   */
  onPressKey?: (key: string, event: GestureResponderEvent) => void
}

export function AmountInputPadKey(props: AmountInputPadKeyProps) {
  const {
    children,
    style: styleOverride,
    value,
    onPressKey,
    ...rest
  } = props

  const viewStyle = mergeAll(flatten([
    STYLE.ROOT,
    styleOverride
  ]))

  function _onPress(event: GestureResponderEvent) {
    if (onPressKey) {
      onPressKey(value, event)
    }
  }

  return (
    <TouchableOpacity
      style={viewStyle}
      onPress={_onPress}
      {...rest}
    >
      {children ||
        <Text
          text={value}
          style={STYLE.VALUE}
        />
      }
    </TouchableOpacity>
  )
}