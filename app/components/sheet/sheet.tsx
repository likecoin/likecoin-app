import React, { FunctionComponent, PropsWithChildren } from "react"
import { View } from "react-native"

import { presets } from "./sheet.presets"
import { SheetProps } from "./sheet.props"
import { injectStyle } from "./sheet.utils"

/**
 * A sheet like container component with corner radius & drop shadow
 */
export const Sheet: FunctionComponent<SheetProps> = (props: PropsWithChildren<SheetProps>) => {
  const {
    children,
    style,
    ...rest
  } = props
  const viewStyle = [
    presets[props.preset],
    style,
  ]

  return (
    <View style={viewStyle} {...rest}>
      {injectStyle(children)}
    </View>
  )
}

Sheet.defaultProps = {
  preset: "raised",
}
