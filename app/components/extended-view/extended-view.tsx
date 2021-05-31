import * as React from "react"
import { Dimensions, View } from "react-native"
import styled from "styled-components/native"

import { ExtendedViewProps } from "./extended-view.props"
import { ExtendedViewStyle as Style } from "./extended-view.style"

export const UnderlayView = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: ${Math.max(Dimensions.get("screen").height, Dimensions.get("screen").width)}px;
  background-color: ${({ theme }) => theme.color.background.primary};
`

/**
 * A view that has a background that is extended from the top
 */
export function ExtendedView(props: ExtendedViewProps) {
  const { style, backgroundColor, ...restProps } = props
  const backgroundStyle = backgroundColor ? { backgroundColor: backgroundColor } : {}
  return (
    <View
      style={[Style.Root, backgroundStyle, style]}
      {...restProps}
    >
      <View style={[Style.ExtendView, backgroundStyle]} />
      {props.children}
    </View>
  )
}
