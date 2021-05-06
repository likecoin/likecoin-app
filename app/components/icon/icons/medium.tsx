import * as React from "react"
import { Svg, SvgProps, Path } from "react-native-svg"

export function MediumIcon(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 28 28"
      {...props}
    >
      <Path
        d="M21.94 9.28h-.64a.72.72 0 00-.57.56v7.93a.67.67 0 00.57.52h.64v1.88h-5.78v-1.89h1.21V9.95h-.06l-2.82 10.21H12.3L9.52 10h-.07v8.33h1.21v1.88H5.82v-1.93h.62a.68.68 0 00.56-.51V9.84a.72.72 0 00-.59-.56h-.59V7.4h6.05l2 7.39h.05l2-7.39h6v1.88z"
        fill={props.color}
      />
    </Svg>
  )
}
