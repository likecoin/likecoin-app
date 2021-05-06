import * as React from "react"
import { Svg, SvgProps, Path } from "react-native-svg"
import styled, { useTheme } from "styled-components/native"

const ICON_STROKE_WIDTH = 2

const SvgView = styled(Svg)`
  flex-shrink: 0;
`

interface IconProps extends SvgProps {}

function IconNavigateNext({ color, ...props}: IconProps) {
  return (
    <SvgView
      width={6.406}
      height={12.811}
      viewBox="0 0 6.406 12.811"
      {...props}
    >
      <Path
        d="M1.406 11.406l4-5-4-5"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={ICON_STROKE_WIDTH}
      />
    </SvgView>
  )
}

function IconLaunch({ color, ...props}: IconProps) {
  return (
    <SvgView
      width={14}
      height={14}
      viewBox="0 0 14 14" {...props}
    >
      <Path
        d="M9 1h4v4M13 1L7 7M5 1H2.5A1.5 1.5 0 001 2.5v9A1.5 1.5 0 002.5 13h9a1.5 1.5 0 001.5-1.5V9"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={ICON_STROKE_WIDTH}
      />
    </SvgView>
  )
}

const accessoryIconMap = {
  'navigate-next': IconNavigateNext,
  launch: IconLaunch,
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
