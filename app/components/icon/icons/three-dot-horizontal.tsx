import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

export function ThreeDotHorizontalIcon({ color, ...props}: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M4.5 13A1.5 1.5 0 103 11.5 1.5 1.5 0 004.5 13zM12.5 13a1.5 1.5 0 10-1.5-1.5 1.5 1.5 0 001.5 1.5zM20.5 13a1.5 1.5 0 10-1.5-1.5 1.5 1.5 0 001.5 1.5z"
        fill={color}
      />
    </Svg>
  )
}
