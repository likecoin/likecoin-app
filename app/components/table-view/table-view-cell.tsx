import * as React from "react"
import { TouchableOpacityProps } from "react-native";
import styled, { css } from "styled-components/native"

import { TableViewCellAccessoryIconType, TableViewCellAccessoryView } from "./table-view-cell-accessory";

interface CellViewProps {
  isFirstCell?: boolean
  isLastCell?: boolean
  hasAccessoryView?: boolean
}

interface CellViewComputedProps {
  cornerRadius: string
}

const CellView = styled.TouchableOpacity.attrs<CellViewProps, CellViewComputedProps>(() => ({
  cornerRadius: "14px",
}))<CellViewProps>`
  flex-direction: row;
  flex: 1;

  background-color: ${props => props.theme.palette.white};
  border-color: ${props => props.theme.palette.greyd8};

  padding: 16px;
  ${props => !!props.hasAccessoryView && css`
    padding-right: 12px;
  `}

  ${({ isFirstCell, cornerRadius: radius }) => isFirstCell && css<CellViewComputedProps>`
    border-top-left-radius: ${radius};
    border-top-right-radius: ${radius};
  `}

  ${({ isLastCell, cornerRadius: radius }) => isLastCell && css<CellViewComputedProps>`
    border-bottom-left-radius: ${radius};
    border-bottom-right-radius: ${radius};
  `}
`

const CellContentView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const AppendContentWrapper = styled.View`
  margin-right: 10px;
`

const TextContentWrapper = styled.View`
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
  margin-left: 12px;
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
        {append && <AppendContentWrapper>{append}</AppendContentWrapper>}
        {children || (
          <TextContentWrapper>
            {!!title && <CellTitle>{title}</CellTitle>}
            {!!subtitle && <CellSubtitle>{subtitle}</CellSubtitle>}
          </TextContentWrapper>
        )}
      </CellContentView>
      {!!accessoryIcon && <TableViewCellAccessoryView icon={accessoryIcon}/>}
    </CellView>
  )
}
