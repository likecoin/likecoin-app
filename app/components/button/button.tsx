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

import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import { Icon } from "../icon"
import { Text } from "../text"
import { sizes } from "../text/text.sizes"
import {
  color,
  gradient,
  spacing,
} from "../../theme"

export const PREPEND: ViewStyle = {
  marginRight: spacing[2],
}

function _renderPrependElement(element: React.ReactElement) {
  if (!element) return null
  return React.cloneElement(element, {
    style: StyleSheet.flatten([element.props.style, PREPEND]),
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
    preset = "primary",
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
  if (size) {
    textStyleFromProps.fontSize = sizes[size]
  }
  if (weight) {
    textStyleFromProps.fontWeight = weight
  }
  if (colorName) {
    textStyleFromProps.color = color.palette[colorName]
  }
  const textStyleList = [
    textPresets[preset] || textPresets.primary,
    textStyleFromProps,
    textStyleOverride
  ]
  const textStyle = StyleSheet.flatten(textStyleList)

  let content = children || (icon ? (
    <Icon
      name={icon}
      color={colorName}
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
          {_renderPrependElement(prepend)}
          {content}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {_renderPrependElement(prepend)}
      {content}
    </TouchableOpacity>
  )
}
