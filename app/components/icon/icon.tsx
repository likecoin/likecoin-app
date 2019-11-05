import * as React from "react"

import { IconProps } from "./icon.props"
import { icons } from "./icons"

import { color } from "../../theme"

export function Icon(props: IconProps) {
  const {
    name,
    color: colorName,
    fill,
    ...rest
  } = props
  const Svg = icons[name]
  return <Svg fill={fill || color.palette[colorName]} {...rest} />
}

Icon.defaultProps = {
  color: "white",
  width: 24,
  height: 24,
}
