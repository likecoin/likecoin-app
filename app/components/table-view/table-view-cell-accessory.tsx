import * as React from "react"
import { SvgProps } from "react-native-svg"
import styled, { useTheme } from "styled-components/native"

import { LaunchIcon } from "../icon/icons/launch"
import { NavigateNextIcon } from "../icon/icons/navigate-next"
import { ThreeDotHorizontalIcon } from "../icon/icons/three-dot-horizontal"

function IconNavigateNext(props: SvgProps) {
  return (
    <NavigateNextIcon width={6.406} height={12.811} {...props} />
  )
}

function IconLaunch(props: SvgProps) {
  return (
    <LaunchIcon width={14} height={14} {...props} />
  )
}

function IconMore(props: SvgProps) {
  return (
    <ThreeDotHorizontalIcon width={20} height={20} {...props} />
  )
}

const accessoryIconMap = {
  'navigate-next': IconNavigateNext,
  launch: IconLaunch,
  more: IconMore,
}

export type TableViewCellAccessoryIconType = keyof typeof accessoryIconMap

function getIconView(key: TableViewCellAccessoryIconType) {
  return accessoryIconMap[key]
}

const AccessoryView = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 10px;
`

export interface TableViewCellAccessoryViewProps {
  icon?: TableViewCellAccessoryIconType
}

export function TableViewCellAccessoryView(props: TableViewCellAccessoryViewProps) {
  const IconView = getIconView(props.icon)
  const theme = useTheme()
  return (
    <AccessoryView>
      {IconView && (
        <IconView color={theme.color.text.secondary} />
      )}
    </AccessoryView>
  )
}
