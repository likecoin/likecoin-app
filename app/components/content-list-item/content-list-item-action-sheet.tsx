import * as React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import styled from "styled-components/native"

import { Button as UnstyledButton } from "../button"
import { Text } from "../text"

const ActionSheetRoot = styled.View`
  margin: ${({ theme }) => theme.spacing.lg};
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
      <SafeAreaView>
        {children}
      </SafeAreaView>
    </ActionSheetRoot>
  )
}

export const ActionSheetButton = styled(UnstyledButton)`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.color.background.primary};
`

export const ActionSheetButtonTitle = styled(Text)`
  font-size: ${({ theme }) => theme.text.size.md};
  text-align: left;
`
