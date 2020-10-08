import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

export function BookmarkIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M19 22.67l-7-4.81-7 4.81v-19A3.09 3.09 0 018 .5h8a3.09 3.09 0 013 3.13zm-7-7.24l5 3.44V3.63a1.09 1.09 0 00-1-1.13H8a1.09 1.09 0 00-1 1.13v15.24z"
        fill="currentColor"
      />
    </Svg>
  )
}

export default BookmarkIcon
