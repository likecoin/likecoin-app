import * as React from "react"
import { Svg, SvgProps, Path } from "react-native-svg"

export function NavigateNextIcon({ color, ...props}: SvgProps) {
  return (
    <Svg
      viewBox="0 0 6.406 12.811"
      {...props}
    >
      <Path
        d="M1.406 11.406l4-5-4-5"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  )
}
