import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const NFTStackIcon = ({ color, fill, ...props }: SvgProps) => (
  <Svg viewBox="0 0 20 20" {...props}>
    <Path
      d="m15.55 11.9 3.19 1.9L9.99 19l-8.74-5.2 3.19-1.9 5.55 3.3 5.55-3.3ZM10 11.41l-5.55-3.3-3.19 1.9 8.75 5.2 8.75-5.2-3.19-1.9-5.55 3.3Zm8.75-5.2L10 1 1.25 6.2 10 11.4l8.75-5.2Z"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      stroke={fill || color}
    />
  </Svg>
)

export default NFTStackIcon
