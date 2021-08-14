import * as React from "react"
import { StyleSheet, View, ViewProps } from "react-native"
import styled from "styled-components/native"

import { TableViewCellProps } from "./table-view-cell"

export const TableViewSeparator = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.separator};
`

interface TableViewProps {
  children: React.ReactElement | React.ReactElement[]
  style?: ViewProps
}

export function TableView({
  children: originChildren,
  ...props
}: TableViewProps) {
  const children: React.ReactElement[] = []
  React.Children.toArray(originChildren).filter(c => !!c).forEach((child, index, newChildren) => {
    if (index > 0) {
      children.push(<TableViewSeparator key={`separator-${index}`} />)
    }
    children.push(
      React.cloneElement<TableViewCellProps>(
        child,
        {
          ...child.props,
          key: `${index}`,
          isFirstCell: index === 0,
          isLastCell: index === newChildren.length - 1,
        }
      )
    )
  })
  return (
    <View {...props}>
      {children}
    </View>
  )
}
