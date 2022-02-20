import * as React from "react"
import { Animated, Platform, ScrollViewProps } from "react-native"
import styled from "styled-components/native"

import { HeaderTab } from "../header-tab"
import { ScrollViewShadow } from "../scroll-view"

const HEADER_HEIGHT = 80

const View = styled.View`
  flex: 1;
`

const HeaderTabWrapper = styled.View`
  position: absolute;
  overflow: hidden;
  z-index: 10;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
`

export interface HeaderTabContainerViewProps {
  /**
   * Header tab value
   */
  value?: string

  /**
   * Header tab items
   */
  items?: React.ReactElement | React.ReactElement[]

  children?: (props: ScrollViewProps) => React.ReactNode

  /**
   * Callback when changing tab value
   */
  onChange?: (value: string) => void
}

/**
 * Container view with header tab
 */
export function HeaderTabContainerView({
  value,
  items,
  children,
  onChange,
  ...props
}: HeaderTabContainerViewProps) {
  const scrollY = React.useRef(new Animated.Value(0)).current

  const onScroll = Animated.event([
    {
      nativeEvent: {
        contentOffset: {
          y: scrollY,
        },
      },
    },
  ], { useNativeDriver: true })

  const headerTabViewTranslateY = Animated.multiply(
    Animated.diffClamp(
      scrollY.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 0, 1],
      }),
      0,
      HEADER_HEIGHT
    ),
    -1
  )
  
  const headerTabViewStyle = {
    transform: [{ translateY: headerTabViewTranslateY }]
  }

  const scrollViewShadowStyle = {
    opacity: headerTabViewTranslateY.interpolate({
      inputRange: [-HEADER_HEIGHT, 0],
      outputRange: [0.5, 0],
    }),
  }

  return (
    <View {...props}>
      <ScrollViewShadow style={scrollViewShadowStyle} />
      <HeaderTabWrapper>
        <Animated.View style={headerTabViewStyle}>
          <HeaderTab value={value} onChange={onChange}>
            {items}
          </HeaderTab>
        </Animated.View>
      </HeaderTabWrapper>
      {!!children && children({
        onScroll,
        contentInset: { top: HEADER_HEIGHT },
        contentOffset: {
          x: 0,
          y: Platform.OS === "ios" ? -HEADER_HEIGHT : 0,
        },
        style: {
          paddingVertical: Platform.OS === "android" ? HEADER_HEIGHT : 0,
        },
      })}
    </View>
  )
}
