import * as React from "react"
import styled from "styled-components/native"

import { Button as UnstyledButton } from "../button"
import { Text } from "../text"

const ActionSheetRoot = styled.View`
  margin: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
`

export interface ContentListItemActionSheetProps {
  children?: React.ReactNode
}

export function ContentListItemActionSheet({
  children,
  ...props
}: ContentListItemActionSheetProps) {
  return (
    <ActionSheetRoot {...props}>
      {children}
    </ActionSheetRoot>
  )
}

export const ActionSheetButton = styled(UnstyledButton)`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.color.background.primary};
`

export const ActionSheetButtonTitle = styled(Text)`
  width: 100%;
  font-size: ${({ theme }) => theme.text.size.md};
  text-align: left;
`
