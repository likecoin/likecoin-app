import * as React from "react"
import { Svg, SvgProps, Path } from "react-native-svg"

export function LaunchIcon({ color, ...props}: SvgProps) {
  return (
    <Svg
      viewBox="0 0 14 14"
      {...props}
    >
      <Path
        d="M9 1h4v4M13 1L7 7M5 1H2.5A1.5 1.5 0 001 2.5v9A1.5 1.5 0 002.5 13h9a1.5 1.5 0 001.5-1.5V9"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  )
}
