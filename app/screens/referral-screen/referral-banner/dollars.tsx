import * as React from "react"
import { Svg, SvgProps, Path, G, Circle } from "react-native-svg"

import { color } from "../../../theme"

function Dollars(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 77.45 91.64"
      {...props}
    >
      <Path
        d="M63 16.6L12.5 45.87 63 75.4"
        fill="none"
        stroke={color.palette.likeCyan}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={10.69}
      />
      <G fill="#eab473">
        <Path d="M77.44 75.91c0 9.14-6.44 15.73-14.44 15.73s-14.54-6.59-14.54-15.73S54.94 58.56 63 58.56s14.49 8.22 14.49 17.35M77.44 17.37C77.44 26.5 71 33.09 63 33.09S48.46 26.5 48.46 17.37 54.94 0 63 0s14.44 8.23 14.44 17.37M29 46.64c0 9.14-6.49 15.73-14.49 15.73S0 55.78 0 46.64s6.5-17.35 14.5-17.35S29 37.51 29 46.64" />
      </G>
      <G fill="#f4d389">
        <Circle cx={62.95} cy={73.05} r={14.5} />
        <Circle cx={62.95} cy={14.5} r={14.5} />
        <Circle cx={14.5} cy={43.77} r={14.5} />
      </G>
      <G
        fill="none"
        stroke="#936947"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.44}
      >
        <Path d="M66.57 68.76a5.52 5.52 0 00-4.29-1.68c-1.52.12-3.28 1-3.37 2.74a2.6 2.6 0 002.15 2.74A41.13 41.13 0 0165.2 74a3 3 0 01-.86 5.62c-1.29.28-3.51.43-6.14-1.94M63 64.53v17M66.57 10.21a5.52 5.52 0 00-4.29-1.68c-1.52.13-3.28 1-3.37 2.74A2.6 2.6 0 0061.06 14a41.13 41.13 0 014.14 1.4 3.23 3.23 0 011.68 3.09A3.25 3.25 0 0164.34 21c-1.29.27-3.51.43-6.14-1.95M63 6v17M18.12 39.48a5.54 5.54 0 00-4.28-1.68c-1.52.13-3.28 1-3.37 2.74a2.58 2.58 0 002.14 2.74 43 43 0 014.15 1.4 3 3 0 01-.87 5.63c-1.29.27-3.51.43-6.13-1.94M14.5 35.25v17" />
      </G>
    </Svg>
  )
}

export default Dollars
