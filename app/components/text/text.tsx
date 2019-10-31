import * as React from "react"
import {
  StyleSheet,
  Text as ReactNativeText,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { mergeAll, flatten } from "ramda"

import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { sizes } from "./text.sizes"
import { translate } from "../../i18n"
import { color, spacing } from "../../theme"

const TEXT_WRAPPER: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
}
const PREPEND: ViewStyle = {
  margin: spacing[0],
  marginRight: spacing[1],
  padding: spacing[0],
}

/**
 * Render a prepend element
 * 
 * @param element The prepend element
 * @param size The size of the element
 */
function _renderPrependChild(
  element: React.ReactElement,
  textStyle: TextStyle | TextStyle[],
) {
  const { style, ...rest } = element.props
  const size = StyleSheet.flatten(textStyle).fontSize
  const props = {
    style: [PREPEND, style, textStyle] as ViewStyle,
    width: size,
    height: size,
    ...rest
  }
  return React.cloneElement(element, props)
}

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
    prepend: prependChild,
    children,
    color: colorName,
    size,
    weight,
    align,
    isHidden,
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
  if (isHidden) {
    styleList.push({ opacity: 0 })
  }
 
  const style = mergeAll(flatten(styleList))

  const textElement = (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  )

  if (prependChild) {
    return (
      <View style={TEXT_WRAPPER}>
        {_renderPrependChild(
          prependChild,
          style,
        )}
        {textElement}
      </View>
    )
  }
  return textElement
}
