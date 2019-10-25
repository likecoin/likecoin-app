import * as React from "react"
import { Text as ReactNativeText, TextStyle } from "react-native"
import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { translate } from "../../i18n"
import { mergeAll, flatten } from "ramda"
import { sizes } from "./text.sizes"
import { color } from "../../theme"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: TextProps) {
  // grab the props
  const {
    preset = "default",
    tx,
    txOptions,
    text,
    children,
    color: colorName,
    size,
    weight,
    align,
    style: propStyle,
    ...rest
  } = props

  // figure out which content to use
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const styleOverride: TextStyle = {}
  if (size) styleOverride.fontSize = sizes[size]
  if (weight) styleOverride.fontWeight = weight
  if (colorName) styleOverride.color = color.palette[colorName]
  if (align) styleOverride.textAlign = align

  const styleList = [
    presets[preset] || presets.default,
    styleOverride,
    propStyle
  ]

  const style = mergeAll(flatten(styleList))

  return (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  )
}
