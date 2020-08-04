import * as React from "react"
import ReactNativeSvg from "react-native-svg"

import { IconProps } from "./icon.props"
import { icons } from "./icons"

import { color } from "../../theme"

export function Icon(props: IconProps) {
  const { name, color: colorName, fill, ...rest } = props
  const Svg = icons[name]

  // FIXME: SVG is not converted in test
  if (typeof Svg !== "function") {
    return <ReactNativeSvg {...rest} />
  }

  return <Svg fill={fill || color.palette[colorName] || colorName} {...rest} />
}

Icon.defaultProps = {
  color: "white",
  width: 24,
  height: 24,
}
