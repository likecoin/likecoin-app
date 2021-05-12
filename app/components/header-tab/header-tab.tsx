import * as React from "react"
import styled from "styled-components/native"

import { HeaderTabItemProps } from "./header-tab-item"

const HeaderTabItemContainer = styled.View`
  flex-direction: row;
  align-items: stretch;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

export interface HeaderTabProps {
  /**
   * Controlling active Header Tab Item
   */
  value?: string

  /**
   * Header Tab Item(s)
   */
  children: React.ReactElement | React.ReactElement[]

  /**
   * Callback when value change
   */
  onChange?: (value: string) => void
}

/**
 * Header Tab
 */
export function HeaderTab({
  value,
  children: originChildren,
  onChange,
  ...props
}: HeaderTabProps) {
  const children = React.Children.map(originChildren, (child) => {
    const { value: childValue, onPress: childOnPress, ...childProps } = child.props
    return (
      React.cloneElement<HeaderTabItemProps>(
        child,
        {
          ...childProps,
          key: childValue,
          isActive: childValue === value,
          onPress: (event) => {
            if (onChange) onChange(childValue)
            if (childOnPress) childOnPress(event)
          },
        }
      )
    )
  })
  return (
    <HeaderTabItemContainer {...props}>
      {children}
    </HeaderTabItemContainer>
  )
}
