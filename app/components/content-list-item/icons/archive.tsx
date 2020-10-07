import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

export function ArchiveIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M20.63 9H3.37A1.37 1.37 0 012 7.63V5.37A1.37 1.37 0 013.37 4h17.26A1.37 1.37 0 0122 5.37v2.26A1.37 1.37 0 0120.63 9z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <Path
        d="M10 13h4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Path
        d="M20 9v9.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18.5V9"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  )
}

