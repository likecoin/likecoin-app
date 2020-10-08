import * as React from "react"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"
import { Button } from "../button"
import { Icon } from "../icon"
import { Text } from "../text"

import { ContentListItemStyle as StyleCommon } from "./content-list-item.style"

const Style = StyleSheet.create({
  Button: {
    flexShrink: 0,
    marginLeft: spacing[2],
    paddingHorizontal: 0,
  } as ViewStyle,
  ButtonIcon: {
    marginLeft: 0,
  } as ViewStyle,
  Label: {
    color: color.palette.grey9b,
    fontWeight: "600",
  } as TextStyle,
  LabelWrapper: {
    flexShrink: 1,
    flexGrow: 1,
    overflow: "hidden",
  } as ViewStyle,
  Root: StyleSheet.flatten([
    StyleCommon.Inset,
    {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: color.palette.lightCyan,
    } as ViewStyle,
  ]),
})

interface ContentListItemUndoViewProps {
  tx: string
  txOptions?: object
  append?: React.ReactElement
  onPress: () => void
}

export function ContentListItemUndoView(props: ContentListItemUndoViewProps) {
  return (
    <View style={Style.Root}>
      {!!props.append && props.append}
      <View style={Style.LabelWrapper}>
        <Text
          tx={props.tx}
          txOptions={props.txOptions}
          numberOfLines={1}
          ellipsizeMode="middle"
          style={Style.Label}
        />
      </View>
      <Button
        preset="plain"
        tx="common.undo"
        fontSize="default"
        append={
          <Icon
            name="undo"
            width={16}
            height={16}
            fill={color.primary}
            style={Style.ButtonIcon}
          />
        }
        style={Style.Button}
        onPress={props.onPress}
      />
    </View>
  )
}
