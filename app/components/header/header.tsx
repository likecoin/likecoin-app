import * as React from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { HeaderProps } from "./header.props"

import { Button } from "../button"
import { Text } from "../text"
import { sizes } from "../text/text.sizes"

import { spacing, color } from "../../theme"
import { translate } from "../../i18n/"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: 44,
}
const TITLE: TextStyle = {
  textAlign: "center",
  color: color.palette.white,
  fontSize: sizes.medium,
  fontWeight: "bold",
}
const TITLE_MIDDLE: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  padding: spacing[2],
}
const SIDE_VIEW_BASE: ViewStyle = {
  width: 60,
  justifyContent: "center",
}
const LEFT: ViewStyle = {
  ...SIDE_VIEW_BASE,
  alignItems: "flex-start",
}
const RIGHT: ViewStyle = {
  ...SIDE_VIEW_BASE,
  alignItems: "flex-end",
}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export class Header extends React.Component<HeaderProps, {}> {
  render() {
    const {
      onLeftPress,
      onRightPress,
      rightIcon,
      rightIconColor = "white",
      rightView,
      leftIcon,
      leftIconColor = "white",
      leftView,
      headerText,
      headerTx,
      titleStyle,
      children,
    } = this.props
    const header = headerText || (headerTx && translate(headerTx)) || ""

    return (
      <View style={{ ...ROOT, ...this.props.style }}>
        <View style={LEFT}>
          {leftIcon ? (
            <Button
              preset="icon"
              icon={leftIcon}
              color={leftIconColor}
              onPress={onLeftPress}
            />
          ) : (
            leftView
          )}
        </View>
        <View style={TITLE_MIDDLE}>
          {children || (
            <Text
              style={{ ...TITLE, ...titleStyle }}
              text={header}
              numberOfLines={1}
            />
          )}
        </View>
        <View style={RIGHT}>
          {rightIcon ? (
            <Button
              preset="icon"
              icon={rightIcon}
              color={rightIconColor}
              onPress={onRightPress}
            />
          ) : (
            rightView
          )}
        </View>
      </View>
    )
  }
}
