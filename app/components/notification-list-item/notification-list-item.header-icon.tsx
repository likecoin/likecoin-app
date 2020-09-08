import * as React from "react"
import {
  G,
  Path,
  Svg,
  SvgProps,
} from "react-native-svg"

import {
  NotificationType,
} from "./notification-list-item.props"

import { color } from "../../theme"

export function Send(props: SvgProps) {
  const {
    color: stroke = color.palette.angry,
    ...rest
  } = props
  return (
    <Svg viewBox="0 0 9.32 7.5" {...rest}>
      <G
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <Path d="M5.55 6.75l3.02-3H1.75h6.82l-3.02-3M.75.75v6" />
      </G>
    </Svg>
  )
}

export function Receive(props: SvgProps) {
  const {
    color: stroke = color.palette.green,
    ...rest
  } = props
  return (
    <Svg viewBox="0 0 9.32 7.5" {...rest}>
      <G
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <Path d="M4.55 6.75l3.02-3H.75h6.82l-3.02-3M8.57.75v6" />
      </G>
    </Svg>
  )
}

export function getHeaderIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.Send:
      return Send

    case NotificationType.Receive:
      return Receive

    default:
      return null
  }
}
