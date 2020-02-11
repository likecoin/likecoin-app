import * as React from "react"
import { View } from "react-native"

import { ExtendedViewProps } from "./extended-view.props"
import { ExtendedViewStyle as Style } from "./extended-view.style"

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
