import * as React from "react"
import {
  Linking,
  TouchableHighlightProps,
} from "react-native";
import styled, { css, useTheme } from "styled-components/native"

import { translate } from "../../i18n"

import {
  TableViewCellAccessoryIconType,
  TableViewCellAccessoryView,
} from "./table-view-cell-accessory";

interface CellViewProps {
  isFirstCell?: boolean
  isLastCell?: boolean
  isChildrenRaw?: boolean
  isNoPadding?: boolean
  isNoBackground?: boolean
  hasAccessoryView?: boolean
}

interface CellViewComputedProps {
  cornerRadius: string
}

const CellView = styled.TouchableHighlight.attrs<CellViewProps, CellViewComputedProps>(() => ({
  cornerRadius: "14px",
}))<CellViewProps>`
  overflow: hidden;

  ${(props) => !props.isNoBackground && css`
    background-color: ${props.theme.color.background.primary};
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

const CellInnerView = styled.View<CellViewProps>`
  ${props => !props.isChildrenRaw && css`
    flex-direction: row;
    flex: 1;
  `}

  ${props => !props.isNoPadding && css`
    padding: ${props.theme.spacing.lg};
  `}
  ${props => !props.isNoPadding && !!props.hasAccessoryView && css`
    padding-right: ${props => props.theme.spacing.md};
  `}
`

const CellContentView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const AppendContentWrapper = styled.View`
  margin-right: ${props => props.theme.spacing.sm};
`

const TextContentWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const CellTitle = styled.Text`
  flex-grow: 1;
  color: ${props => props.theme.color.text.primary};
  font-size: ${props => props.theme.text.size.md};
`

const CellSubtitle = styled.Text`
  color: ${props => props.theme.color.text.secondary};
  margin-left: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.text.size.sm};
`

export interface TableViewCellProps extends TouchableHighlightProps {
  append?: React.ReactNode
  children?: React.ReactNode
  title?: string
  /**
   * Title text which is looked up via i18n.
   */
  titleTx?: string
  /**
   * Optional title options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  titleTxOptions?: object
  subtitle?: string
  /**
   * Subtitle text which is looked up via i18n.
   */
  subtitleTx?: string
  /**
   * Optional subtitle options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  subtitleTxOptions?: object

  href?: string

  isFirstCell?: boolean
  isLastCell?: boolean
  isNoPadding?: boolean
  isNoBackground?: boolean
  isChildrenRaw?: boolean
  accessoryIcon?: TableViewCellAccessoryIconType
}

export function TableViewCell({
  append,
  children,
  title,
  titleTx,
  titleTxOptions,
  subtitle,
  subtitleTx,
  subtitleTxOptions,
  href,
  isFirstCell = true,
  isLastCell = true,
  isChildrenRaw = false,
  isNoPadding = false,
  isNoBackground = false,
  accessoryIcon: accessoryIconOverride,
  ...props
}: TableViewCellProps) {
  const titleContent = title || titleTx && translate(titleTx, titleTxOptions)
  const subtitleContent = subtitle || subtitleTx && translate(subtitleTx, subtitleTxOptions)

  if (href && !props.onPress) {
    props.onPress = () => {
      Linking.openURL(href)
    }
  }

  let accessoryIcon = accessoryIconOverride
  if (!accessoryIcon && accessoryIcon !== null) {
    if (href) {
      accessoryIcon = "launch"
    } else if (props.onPress) {
      accessoryIcon = "navigate-next"
    }
  }

  if (!props.disabled && !props.onPress) {
    props.disabled = true
  }

  const theme = useTheme()

  return (
    <CellView
      isFirstCell={isFirstCell}
      isLastCell={isLastCell}
      isNoBackground={isNoBackground}
      underlayColor={theme.color.background.primary}
      {...props}
    >
      <CellInnerView
        isChildrenRaw={isChildrenRaw}
        isNoPadding={isNoPadding}
        hasAccessoryView={!!accessoryIcon}
      >
        {isChildrenRaw ? children : (
          <CellContentView>
            {append && <AppendContentWrapper>{append}</AppendContentWrapper>}
            {children || (
              <TextContentWrapper>
                {!!titleContent && <CellTitle>{titleContent}</CellTitle>}
                {!!subtitleContent && <CellSubtitle>{subtitleContent}</CellSubtitle>}
              </TextContentWrapper>
            )}
          </CellContentView>
        )}
        {!isChildrenRaw && !!accessoryIcon && <TableViewCellAccessoryView icon={accessoryIcon}/>}
      </CellInnerView>
    </CellView>
  )
}
