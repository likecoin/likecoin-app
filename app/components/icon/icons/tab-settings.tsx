import * as React from "react"
import { Svg, SvgProps, G, Path, Circle } from "react-native-svg"

export function TabSettingsIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <G
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={2}
        fill="none"
        stroke={props.fill || props.color}
      >
        <Path d="M9 6.09h12M3 6.09h2M19 12h2M3 12h11.5M11.5 17.91H21M3 17.91h4" />
        <Circle cx={7} cy={6.09} r={2} />
        <Circle cx={16.75} cy={12} r={2.25} />
        <Circle cx={9.25} cy={17.91} r={2.25} />
      </G>
    </Svg>
  )
}
