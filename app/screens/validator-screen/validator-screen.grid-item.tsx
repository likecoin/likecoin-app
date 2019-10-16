import * as React from "react"
import {
  StyleSheet,
  TextStyle,
  ViewStyle,
  View,
} from "react-native"

import { ValidatorScreenGridItemProps } from "./validator-screen.grid-item.props"

import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"
import { color, spacing } from "../../theme"

const STYLE = StyleSheet.create({
  INNER: {
    padding: spacing[2],
  } as ViewStyle,
  INNER_BORDER: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: `${color.palette.likeCyan}7F`,
  } as ViewStyle,
  LABEL: {
    color: color.palette.greyBlue,
    fontSize: sizes.default,
    marginTop: spacing[1],
    marginBottom: spacing[4],
  } as TextStyle,
  ROOT: {
    padding: spacing[2],
    flexBasis: "100%",
  } as ViewStyle,
  ROOT_HALF: {
    flexBasis: "50%",
  } as ViewStyle,
  VALUE: {
    color: color.palette.white,
    fontSize: sizes.large,
    fontWeight: "bold",
  } as TextStyle,
})

/**
 * Grid item for Validator Screen
 */
export function ValidatorScreenGridItem(props: ValidatorScreenGridItemProps) {
  const {
    children,
    value,
    labelTx,
    isHalf = false,
    isShowSeparator = true,
    isTopLabel = false,
    style,
    innerStyle: overrideInnerStyle,
  } = props

  const rootStyle = [
    STYLE.ROOT,
    !!isHalf && STYLE.ROOT_HALF,
    style,
  ]
  const innerStyle = [
    STYLE.INNER,
    !!isShowSeparator && STYLE.INNER_BORDER,
    overrideInnerStyle,
  ]

  const labelComponent = labelTx && (
    <Text
      tx={labelTx}
      style={STYLE.LABEL}
    />
  )

  return (
    <View style={rootStyle}>
      <View style={innerStyle}>
        {!!isTopLabel && labelComponent}
        {children ||
          <Text
            text={value}
            style={STYLE.VALUE}
          />
        }
        {!isTopLabel && labelComponent}
      </View>
    </View>
  )
}
