import * as React from "react"
import { Svg, SvgProps, G, Path } from "react-native-svg"

import { color } from "../../../theme"

function StripsRight(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 37.23 20.52"
      {...props}
    >
      <G
        fill="none"
        stroke={color.palette.likeCyan}
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={2}
      >
        <Path d="M7.3 19.52H5.75M30.36 19.52h-5.85M10.49 14.89H1M27.33 10.26h-5.64M36.23 5.63h-2.55M11.88 1H3.94" />
      </G>
    </Svg>
  )
}

export default StripsRight
