import * as React from "react"
import {
  StyleSheet,
  Text as ReactNativeText,
  TextProps as ReactNativeTextProps,
  TextStyle,
} from "react-native"

import { I18nProps as Props } from "./i18n.props"

import { TextProps } from "../text"
import { sizes as fontSizes } from "../text/text.sizes"

import { translate } from "../../i18n"

import { color } from "../../theme"

export const I18n = (props: Props) => {
  const {
    tx,
    txOptions: inputTxOptions = {},
    children,
    ...rest
  } = props
  const interpolations = {} as {[place: string]: React.ReactElement<TextProps>}
  React.Children.forEach(children, (child) => {
    const { place } = child.props
    interpolations[place] = child
  })

  const txOptions = Object.keys(interpolations).reduce((pv, key) => {
    pv[key] = `%{${key}}`
    return pv
  }, inputTxOptions)

  const text: string = translate(tx, txOptions)

  const parts:
    (React.ReactElement<ReactNativeTextProps> | string)[] = []
  text.split(/%{|}/g).forEach((part) => {
    if (part) {
      let overridedStyle: TextStyle = {}
      if (interpolations[part]) {
        const {
          color: colorName,
          style,
          weight,
          size: fontSize,
          text: textValue,
          ...restTextProps
        } = interpolations[part].props
        if (style) {
          overridedStyle = StyleSheet.flatten(style)
        }
        if (colorName) {
          overridedStyle.color = color.palette[colorName]
        }
        if (fontSize) {
          overridedStyle.fontSize = fontSizes[fontSize]
        }
        if (weight) {
          overridedStyle.fontWeight = weight
        }
        parts.push(
          <ReactNativeText
            {...restTextProps}
            key={part}
            style={overridedStyle}
          >
            {textValue}
          </ReactNativeText>
        )
      } else {
        parts.push(part)
      }
    }
  })
  return (
    <ReactNativeText {...rest}>
      {parts}
    </ReactNativeText>
  )
}
