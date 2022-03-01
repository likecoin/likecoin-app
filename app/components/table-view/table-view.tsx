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
  const newChildren = React.Children.toArray(originChildren).filter(c => !!c)
  return (
    <View {...props}>
      {React.Children.map(newChildren, (child, index) => {
        const cloneChild = React.cloneElement<TableViewCellProps>(
          child,
          {
            ...child.props,
            isFirstCell: index === 0,
            isLastCell: index === newChildren.length - 1,
          }
        )
        if (index > 0) {
          return (
            <>
              <TableViewSeparator />
              {cloneChild}
            </>
          )
        }
        return cloneChild
      })}
    </View>
  )
}
