import * as React from "react"
import Svg, { G, Path, SvgProps } from "react-native-svg"

export function UnfollowIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <G fill="currentColor">
        <Path d="M12 20.33c-8.26 0-11.77-7.6-11.91-7.92a1 1 0 010-.84c.15-.32 3.81-7.9 11.9-7.9s11.75 7.58 11.9 7.9a1 1 0 010 .84c-.12.32-3.63 7.92-11.89 7.92zM2.12 12c.8 1.49 3.88 6.33 9.88 6.33s9.07-4.86 9.87-6.32c-.83-1.5-4-6.34-9.87-6.34S3 10.52 2.12 12z" />
        <Path d="M12 17a5 5 0 01-3.53-8.53 5 5 0 017.06 0 5 5 0 010 7.06A4.94 4.94 0 0112 17zm0-8a3 3 0 00-2.12 5.12 3.08 3.08 0 004.24 0A3 3 0 0012 9z" />
        <Path d="M3.74 21.26A1 1 0 013 21a1 1 0 010-1.41L19.55 3A1 1 0 1121 4.45L4.45 21a1 1 0 01-.71.26z" />
      </G>
    </Svg>
  )
}
