import * as React from "react"
import { Svg, Path, SvgProps } from "react-native-svg"

const ExternalLinkIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3a1 1 0 0 1 1-1h1a1 1 0 0 0 0-2H3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8a1 1 0 1 0-2 0v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Zm6-3a1 1 0 0 0 0 2h.586L5.293 5.293a1 1 0 0 0 1.414 1.414L10 3.414V4a1 1 0 1 0 2 0V1a1 1 0 0 0-1-1H8Z"
      fill={color}
    />
  </Svg>
)



export default ExternalLinkIcon
