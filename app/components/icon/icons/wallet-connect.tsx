import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

export function WallctConnectIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <Path
        d="M17.83 23a20.33 20.33 0 0128.34 0l.95.92a1 1 0 010 1.39l-3.23 3.19a.5.5 0 01-.71 0l-1.29-1.27a14.21 14.21 0 00-19.78 0l-1.39 1.36a.48.48 0 01-.7 0l-3.23-3.15a1 1 0 010-1.39zm35 6.52l2.87 2.81a1 1 0 010 1.39l-12.93 12.7a1 1 0 01-1.41 0l-9.18-9a.25.25 0 00-.36 0l-9.18 9a1 1 0 01-1.41 0L8.29 33.76a1 1 0 010-1.39l2.87-2.81a1 1 0 011.42 0l9.18 9a.24.24 0 00.35 0l9.18-9a1 1 0 011.42 0l9.18 9a.24.24 0 00.35 0l9.18-9a1 1 0 011.42 0z"
        fill={props.fill || props.color}
      />
    </Svg>
  )
}
