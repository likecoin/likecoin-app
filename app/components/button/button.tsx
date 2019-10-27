import * as React from "react"
import {
  Linking,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native"
import { mergeAll, flatten } from "ramda"

import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import { Text } from "../text"
import { sizes } from "../text/text.sizes"
import { color, spacing } from "../../theme"

export const PREPEND: ViewStyle = {
  marginRight: spacing[2],
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    preset = "primary",
    tx,
    text,
    size,
    weight,
    color: colorName,
    textStyle: textStyleProp,
    style: styleOverride,
    children,
    prepend,
    link,
    isHidden,
    ...rest
  } = props
  const viewStyleList = [
    viewPresets[preset] || viewPresets.primary,
    styleOverride,
  ]
  if (isHidden) {
    rest.disabled = true
    viewStyleList.push({ opacity: 0 })
  }
  const viewStyle = mergeAll(flatten(viewStyleList))

  const textStyleOverride: TextStyle = {}
  if (size) textStyleOverride.fontSize = sizes[size]
  if (weight) textStyleOverride.fontWeight = weight
  if (colorName) textStyleOverride.color = color.palette[colorName]

  const textStyleList = [
    textPresets[preset] || textPresets.primary,
    textStyleOverride,
    textStyleProp
  ]
  const textStyle = mergeAll(flatten(textStyleList))

  const content = children || <Text tx={tx} text={text} style={textStyle} />

  let prependElement: React.ReactNode
  if (prepend) {
    prependElement = React.cloneElement(prepend, {
      style: mergeAll(flatten([prepend.props.style, PREPEND])),
    })
  }

  if (link && !rest.onPress) {
    rest.onPress = () => {
      Linking.openURL(link)
    }
  }

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {prependElement}
      {content}
    </TouchableOpacity>
  )
}
