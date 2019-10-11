import * as React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Image, ImageStyle } from "react-native"

import { Text } from "../text"
import { color, spacing } from "../../theme"

const ROOT: ViewStyle = {
  margin: spacing[2],
}
const ITEM: ViewStyle = {
  flexDirection: "row",
  padding: spacing[5],
  borderRadius: 14,
  backgroundColor: color.palette.white,
  shadowColor: color.palette.black,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 3,
}
const ICON: ImageStyle = {
  width: 32,
  height: 32,
  borderRadius: 6,
  marginRight: 16,
}
const TITLE: TextStyle = {
  color: color.palette.grey4a,
  fontSize: 14,
  fontWeight: "500",
}
const SUBTITLE: TextStyle = {
  color: color.palette.grey9b,
  fontSize: 10,
}

export interface ValidatorListItemProps {
  /**
   * The title text
   */
  name?: string

  /**
   * The icon in URL
   */
  icon?: string

  /**
   * The subtitle text
   */
  subtitle?: string
  
  /**
   * An optional style override useful for padding.
   */
  viewStyle?: ViewStyle

  /**
   * An optional style override useful for margin.
   */
  style?: ViewStyle
}

/**
 * Validator List Item
 */
export function ValidatorListItem(props: ValidatorListItemProps) {
  const { name, icon, subtitle, viewStyle, style, ...rest } = props

  return (
    <TouchableOpacity style={[ROOT, style]} {...rest}>
      <View style={[ITEM, viewStyle]}>
        <Image
          source={{ uri: icon }}
          style={ICON}
        />
        <View>
          <Text text={name} style={TITLE} />
          <Text text={subtitle} style={SUBTITLE} />
        </View>
      </View>
    </TouchableOpacity>
  )
}
