import * as React from "react"
import { Svg, Path, SvgProps } from "react-native-svg"

export default function TickIcon(props: SvgProps) {
  return (
    <Svg
      width={20}
      height={20}
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.636 5.728a1 1 0 0 1 .136 1.408l-7 8.5a1 1 0 0 1-1.48.071l-4-4a1 1 0 1 1 1.415-1.414l3.221 3.221 6.3-7.65a1 1 0 0 1 1.408-.136Z"
        fill={props.color}
      />
    </Svg>
  )
}
