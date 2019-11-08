import * as React from "react"
import {
  Image,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

import { ValidatorListItemProps } from "./validator-list-item.props"
import STYLE from "./validator-list-item.style"

import { Text } from "../text"
import { Sheet } from "../sheet"

import { color } from "../../theme"

/**
 * Validator List Item
 */
export function ValidatorListItem(props: ValidatorListItemProps) {
  const {
    title,
    icon,
    subtitle,
    rightTitle,
    isDarkMode,
    style,
    ...rest
  } = props

  const sheetStyle = [
    STYLE.SHEET,
    {
      backgroundColor: isDarkMode ? color.primary : color.palette.white,
    } as ViewStyle
  ]
  const titleColor = isDarkMode ? "white" : "grey4a"
  const subtitleColor = isDarkMode ? "likeCyan" : "grey9b"
  const rightTitleColor = isDarkMode ? titleColor : "grey9b"

  return (
    <TouchableOpacity style={[STYLE.ROOT, style]} {...rest}>
      <Sheet style={sheetStyle}>
        <View style={STYLE.INNER}>
          <Image
            source={{ uri: icon }}
            style={STYLE.ICON}
          />
          <View style={STYLE.LEFT_DETAIL}>
            <Text
              text={title}
              color={titleColor}
              style={STYLE.TITLE}
            />
            <Text
              text={subtitle}
              color={subtitleColor}
              style={STYLE.SUBTITLE}
            />
          </View>
          <View style={STYLE.RIGHT_DETAIL}>
            <Text
              text={rightTitle}
              color={rightTitleColor}
              align="right"
              style={STYLE.TITLE}
            />
          </View>
        </View>
      </Sheet>
    </TouchableOpacity>
  )
}
