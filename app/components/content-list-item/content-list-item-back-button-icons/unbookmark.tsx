import * as React from "react"
import Svg, { G, Path, SvgProps } from "react-native-svg"

export function UnbookmarkIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <G fill="currentColor">
        <Path d="M19 22.67l-7-4.81-7 4.81v-19A3.09 3.09 0 018 .5h8a3.09 3.09 0 013 3.13zm-7-7.24l5 3.44V3.63a1.09 1.09 0 00-1-1.13H8a1.09 1.09 0 00-1 1.13v15.24z" />
        <Path d="M3.74 19.66A1 1 0 013 18L19.55 1.44A1 1 0 1121 2.85L4.45 19.37a1 1 0 01-.71.29z" />
      </G>
    </Svg>
  )
}
