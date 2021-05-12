import * as React from "react"
import { TouchableOpacityProps } from "react-native"
import styled, { css, useTheme } from "styled-components/native"

import { Icon, IconTypes } from "../icon"

import { Text } from "../text"

interface ChildProps {
  isActive?: boolean
}

const TouchableOpacity = styled.TouchableOpacity`
  flex: 1;
`

const ContentView = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
`

const StripeView = styled.View<ChildProps>`
  height: 4px;

  ${props => props.isActive && css`
    background-color: ${({ theme }) => theme.color.text.feature.highlight.primary};
  `}
`

const TitleText = styled(Text)<ChildProps>`
  color: ${
    props => props.isActive
      ? props.theme.color.text.feature.highlight.primary
      : props.theme.color.text.feature.highlight.secondary
  };
  font-size: ${({ theme }) => theme.text.size.xl};
  font-weight: 500;
`

const SubtitleText = styled(Text)<ChildProps>`
color: ${
  props => props.isActive
    ? props.theme.color.text.feature.primary
    : props.theme.color.text.feature.secondary
};
font-size: ${({ theme }) => theme.text.size.sm};
`

export interface HeaderTabItemProps extends TouchableOpacityProps {
  /**
   * Value of the item for controlling active state under Header Tab
   */
  value?: string

  /**
   * Title which is looked up via i18n.
   */
  titleTx?: string

  /**
   * The title to display if not using `titleTx` or nested components.
   */
  title?: string

  /**
   * Subtitle which is looked up via i18n.
   */
  subtitleTx?: string

  /**
   * The subtitle to display if not using `titleTx` or nested components.
   */
  subtitle?: string

  /**
   * The name of the icon
   */
  icon?: IconTypes

  /**
   * Display active state.
   */
  isActive?: boolean
}

/**
 * Header Tab Item
 */
export function HeaderTabItem(props: HeaderTabItemProps) {
  const {
    title,
    titleTx,
    subtitle,
    subtitleTx,
    isActive = false,
    icon,
    ...rest
  } = props

  const theme = useTheme()
  return (
    <TouchableOpacity {...rest}>
      <ContentView>
        {icon && (
          <Icon
            name={icon}
            color={isActive
              ? theme.color.text.feature.highlight.primary
              : theme.color.text.feature.highlight.secondary}
            width={24}
            height={24}
          />
        )}
        {!!(title || titleTx) && (
          <TitleText
            text={title}
            tx={titleTx}
            isActive={isActive}
          />
        )}
        {!!(subtitle || subtitleTx) && (
          <SubtitleText
            text={subtitle}
            tx={subtitleTx}
            isActive={isActive}
          />
        )}
      </ContentView>
      <StripeView isActive={isActive} />
    </TouchableOpacity>
  )
}
