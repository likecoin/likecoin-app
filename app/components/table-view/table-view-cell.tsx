import * as React from "react"
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native"

import { TableViewCellAccessoryIconType, TableViewCellAccessoryView } from "./table-view-cell-accessory";

const CELL_BORDER_RADIUS = "14px";
const CELL_PADDING = "16px";

interface CellViewProps {
  isFirstCell?: boolean
  isLastCell?: boolean
  hasAccessoryView?: boolean
}

interface CellViewComputedProps {
  topRadius: string
  bottomRadius: string
  padding: string
  paddingRight: string
}

const CellView = styled.TouchableOpacity.attrs<CellViewProps, CellViewComputedProps>((props) => ({
  padding: CELL_PADDING,
  paddingRight: props.hasAccessoryView ? "12px" : CELL_PADDING,
  topRadius: props.isFirstCell ? CELL_BORDER_RADIUS : '0px',
  bottomRadius: props.isLastCell ? CELL_BORDER_RADIUS : '0px',
}))<CellViewProps>`
  flex-direction: row;
  flex: 1;
  padding: ${props => props.padding};
  padding-right: ${props => props.paddingRight};
  background-color: ${props => props.theme.palette.white};
  border-color: ${props => props.theme.palette.greyd8};
  border-top-left-radius: ${props => props.topRadius};
  border-top-right-radius: ${props => props.topRadius};
  border-bottom-left-radius: ${props => props.bottomRadius};
  border-bottom-right-radius: ${props => props.bottomRadius};
`

const CellContentView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const AppendWrapper = styled.View`
  margin-right: 10px;
`

const TextWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const CellTitle = styled.Text`
  flex-grow: 1;
  color: ${props => props.theme.palette.grey4a};
  font-size: 14px;
`

const CellSubtitle = styled.Text`
  color: ${props => props.theme.palette.grey9b};
  font-size: 12px;
`

export interface TableViewCellProps extends TouchableOpacityProps {
  append?: React.ReactNode
  children?: React.ReactNode
  title?: string
  subtitle?: string
  isFirstCell?: boolean
  isLastCell?: boolean
  accessoryIcon?: TableViewCellAccessoryIconType
}

export function TableViewCell({
  append,
  children,
  title,
  subtitle,
  isFirstCell = true,
  isLastCell = true,
  accessoryIcon,
  ...props
}: TableViewCellProps) {
  return (
    <CellView
      isFirstCell={isFirstCell}
      isLastCell={isLastCell}
      hasAccessoryView={!!accessoryIcon}
      {...props}
    >
      <CellContentView>
        {append && <AppendWrapper>{append}</AppendWrapper>}
        {children || (
          <TextWrapper>
            {!!title && <CellTitle>{title}</CellTitle>}
            {!!subtitle && <CellSubtitle>{subtitle}</CellSubtitle>}
          </TextWrapper>
        )}
      </CellContentView>
      {!!accessoryIcon && <TableViewCellAccessoryView icon={accessoryIcon}/>}
    </CellView>
  )
}
