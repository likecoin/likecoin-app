import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const NFTDashboardIcon = ({ color, fill, ...props }: SvgProps) => (
  <Svg {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM5 18a5 5 0 0 1 10 0 1 1 0 1 0 2 0 7 7 0 1 0-14 0 1 1 0 1 0 2 0Z"
      fill={fill || color}
    />
  </Svg>
)

export default NFTDashboardIcon
