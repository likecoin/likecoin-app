import * as React from "react"
import { Svg, SvgProps, G, Path } from "react-native-svg"

import { color } from "../../../theme"

function StripsLeft(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 29.86 28.52"
      {...props}
    >
      <G
        fill="none"
        stroke={color.palette.likeCyan}
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={2}
      >
        <Path d="M17.77 1h11.09M6.87 1h5.85M1 7.63h23.46M16.78 14.26h10.9M5.11 14.26h5.64M11.23 20.89H25M1 20.89h2.56M25.36 27.52h2.93M9.81 27.52h9.13" />
      </G>
    </Svg>
  )
}

export default StripsLeft
