import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

export function UnarchiveIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M10 14.89h4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Path
        d="M20 10.89v9.5a1.5 1.5 0 01-1.5 1.5h-13a1.5 1.5 0 01-1.5-1.5v-9.5z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <Path
        d="M12 9.25V3.5M8 5.5l4-4 4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  )
}
