import * as React from "react"
import { TextStyle, TouchableOpacity } from "react-native"
import { mergeAll, flatten } from "ramda"

import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import { Text } from "../text"
import { sizes } from "../text/text.sizes"
import { color } from "../../theme"

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
    ...rest
  } = props

  const viewStyle = mergeAll(flatten([viewPresets[preset] || viewPresets.primary, styleOverride]))

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

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {content}
    </TouchableOpacity>
  )
}
