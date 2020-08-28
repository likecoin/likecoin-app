import * as React from "react"
import {
  StyleSheet,
  Text as ReactNativeText,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { sizes } from "./text.sizes"
import { translate } from "../../i18n"
import { color, spacing } from "../../theme"

const TEXT_WRAPPER: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}
const WRAPPED_CHILD: ViewStyle = {
  marginTop: spacing[0],
  marginBottom: spacing[0],
  marginLeft: spacing[0],
  marginRight: spacing[0],
  paddingTop: spacing[0],
  paddingBottom: spacing[0],
  paddingLeft: spacing[0],
  paddingRight: spacing[0],
}
const PREPEND: ViewStyle = {
  ...WRAPPED_CHILD,
  marginRight: spacing[1],
}
const APPEND: ViewStyle = {
  ...WRAPPED_CHILD,
  marginLeft: spacing[1],
}

/**
 * Render a prepend or append element
 *
 * @param position The position of the element
 * @param element The prepend or append element
 * @param size The size of the element
 */
function _renderChild(
  position: "prepend" | "append",
  element: React.ReactElement,
  textStyle: TextStyle | TextStyle[],
) {
  const { style, ...rest } = element.props
  const size = StyleSheet.flatten(textStyle).fontSize
  const props = {
    style: [
      position === "prepend" ? PREPEND : APPEND,
      style,
      textStyle,
    ] as ViewStyle,
    width: size,
    height: size,
    ...rest,
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
    append: appendChild,
    children,
    color: colorName,
    size,
    weight,
    align,
    disabled,
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
  if (colorName) styleOverride.color = color.palette[colorName] || colorName
  if (align) styleOverride.textAlign = align

  const styleList = [
    presets[preset] || presets.default,
    propStyle,
    styleOverride,
  ]

  if (isHidden) {
    styleList.push({ opacity: 0 })
  } else if (disabled) {
    styleList.push({ opacity: 0.3 })
  }

  const style = StyleSheet.flatten(styleList)

  if (prependChild || appendChild) {
    return (
      <View style={[style, TEXT_WRAPPER]}>
        {!!prependChild && _renderChild("prepend", prependChild, style)}
        <ReactNativeText {...rest} style={StyleSheet.flatten([style, WRAPPED_CHILD])}>
          {content}
        </ReactNativeText>
        {!!appendChild && _renderChild("append", appendChild, style)}
      </View>
    )
  }
  return (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  )
}
