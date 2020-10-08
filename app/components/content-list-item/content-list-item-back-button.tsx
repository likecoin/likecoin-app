import * as React from "react"
import { GestureResponderEvent, TouchableOpacity } from "react-native"

import { Text } from "../text"

import {
  ContentListItemBackButtonPreset,
  textPresets,
  viewPresets,
} from "./content-list-item-back-button.style"

import {
  backButtonIcons,
  ContentListItemBackButtonIconType,
} from "./content-list-item-back-button-icons"

export interface ContentListItemBackButtonProps {
  preset?: ContentListItemBackButtonPreset
  icon?: ContentListItemBackButtonIconType
  tx?: string
  txOptions?: object
  onPress?: (event: GestureResponderEvent) => void
}

export function ContentListItemBackButton(
  props: ContentListItemBackButtonProps,
) {
  const { preset = "primary" } = props
  const Icon = backButtonIcons[props.icon]
  const textStyle = textPresets[preset]
  return (
    <TouchableOpacity style={viewPresets[preset]} onPress={props.onPress}>
      {!!Icon && <Icon width={24} height={24} color={textStyle.color} />}
      <Text
        tx={props.tx}
        txOptions={props.txOptions}
        style={textStyle}
      />
    </TouchableOpacity>
  )
}
