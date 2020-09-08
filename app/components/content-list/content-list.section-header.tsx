import * as React from "react"
import { View } from "react-native"

import {
  ContentListSectionHeaderProps as Props,
} from "./content-list.section-header.props"
import {
  ContentListSectionHeaderStyle as Style,
} from "./content-list.section-header.style"

import { Text } from "../text"

export function ContentListSectionHeader(props: Props) {
  return (
    <View style={Style.Root}>
      <Text
        text={props.text}
        style={Style.Text}
      />
    </View>
  )
}
