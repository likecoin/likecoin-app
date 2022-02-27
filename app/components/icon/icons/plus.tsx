import * as React from "react"
import { Svg, Path, SvgProps } from "react-native-svg"

export default function PlusIcon(props: SvgProps) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 15a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4V5a1 1 0 1 0-2 0v4h-4a1 1 0 0 0 0 2h4v4Z"
        fill={props.color}
      />
    </Svg>
  )
}
