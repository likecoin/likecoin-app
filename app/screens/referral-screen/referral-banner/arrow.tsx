import * as React from "react"
import { Svg, SvgProps, Path } from "react-native-svg"

import { color } from "../../../theme"

function Arrow(props: SvgProps) {
  return (
    <Svg viewBox="0 0 120 38.6" {...props}>
      <Path
        d="M119.17 7.38H94.89V0H25.11v7.38H.83c-.95 0-1.15 2.08-.25 2.53L57.41 38a5.64 5.64 0 005.18 0l56.83-28.09c.9-.45.7-2.53-.25-2.53z"
        fill={color.palette.likeGreen}
      />
    </Svg>
  )
}

export default Arrow