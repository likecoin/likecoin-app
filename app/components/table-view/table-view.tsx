import * as React from "react"
import { StyleSheet, View } from "react-native"
import styled from "styled-components/native"

import { TableViewCellProps } from "./table-view-cell"

export const TableViewSeparator = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.separator};
`

interface TableViewProps {
  children: React.ReactElement | React.ReactElement[]
}

export function TableView({
  children: originChildren,
  ...props
}: TableViewProps) {
  const children: React.ReactElement[] = []
  const lastIndex = React.Children.count(originChildren) - 1
  React.Children.forEach(originChildren, (child, index) => {
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
          isLastCell: index === lastIndex,
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
