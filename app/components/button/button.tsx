import * as React from "react"
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"

import { viewPresets, textPresets, viewSizePresets, textSizePresets, iconSizePresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import { Icon } from "../icon"
import { Text } from "../text"
import { sizes as fontSizes } from "../text/text.sizes"
import {
  color,
  gradient,
  spacing,
} from "../../theme"

export const PREPEND: ViewStyle = {
  marginRight: spacing[2],
}
export const APPEND: ViewStyle = {
  marginLeft: spacing[2],
}

function _renderSideElement(
  element: React.ReactElement,
  prepend = true
) {
  if (!element) return null
  return React.cloneElement(element, {
    style: StyleSheet.flatten([
      prepend ? PREPEND : APPEND,
      element.props.style,
    ]),
  })
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    children,
    color: colorName,
    isHidden,
    isLoading,
    icon,
    link,
    prepend,
    append,
    preset = "primary",
    fontSize,
    size,
    style: styleOverride,
    text,
    textStyle: textStyleOverride,
    tx,
    weight,
    ...rest
  } = props
  const viewStyleList = [
    viewPresets[preset] || viewPresets.primary,
    viewSizePresets[size] || viewSizePresets.default,
    styleOverride,
  ]

  if (rest.disabled) {
    viewStyleList.push({ opacity: 0.3 })
  }

  if (isHidden) {
    rest.disabled = true
    viewStyleList.push({ opacity: 0 })
  }
  const viewStyle = StyleSheet.flatten(viewStyleList)

  const textStyleFromProps: TextStyle = {}
  if (fontSize) {
    textStyleFromProps.fontSize = fontSizes[fontSize]
  }
  if (weight) {
    textStyleFromProps.fontWeight = weight
  }
  if (colorName) {
    textStyleFromProps.color = color.palette[colorName]
  }
  const textStyleList = [
    textPresets[preset] || textPresets.primary,
    textSizePresets[size] || textSizePresets.default,
    textStyleFromProps,
    textStyleOverride
  ]
  const textStyle = StyleSheet.flatten(textStyleList)

  const iconSize: number = iconSizePresets[size] || iconSizePresets.default

  let content = children || (icon ? (
    <Icon
      name={icon}
      color={textStyle.color}
      width={iconSize}
      height={iconSize}
    />
  ) : (
    <Text
      tx={tx}
      text={text}
      style={textStyle}
    />
  ))

  if (isLoading) {
    rest.disabled = true
    content = (
      <ActivityIndicator
        color={textStyle.color}
        size="small"
      />
    )
  }

  if (link && !rest.onPress) {
    rest.onPress = () => {
      Linking.openURL(link)
    }
  }

  if (preset === "gradient") {
    return (
      <TouchableOpacity {...rest}>
        <LinearGradient
          colors={gradient.LikeCoin}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={viewStyle}
        >
          {_renderSideElement(prepend)}
          {content}
          {_renderSideElement(append, false)}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {_renderSideElement(prepend)}
      {content}
      {_renderSideElement(append, false)}
    </TouchableOpacity>
  )
}
