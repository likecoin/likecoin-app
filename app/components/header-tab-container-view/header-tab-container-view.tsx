import * as React from "react"
import { Animated, ScrollViewProps, StyleSheet } from "react-native"
import styled from "styled-components/native"

import { HeaderTab } from "../header-tab"

const View = styled.View`
  flex: 1;
`

const HeaderTabShadow = styled(Animated.View)`
  position: absolute;
  z-index: 11;
  left: 0;
  right: 0;
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.separator};
`

const HeaderTabWrapper = styled.View`
  position: absolute;
  overflow: hidden;
  z-index: 10;
  left: 0;
  right: 0;
  height: 80px;
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
      80
    ),
    -1
  )
  
  const headerTabViewStyle = {
    transform: [{ translateY: headerTabViewTranslateY }]
  }

  return (
    <View {...props}>
      <HeaderTabShadow
        style={{
          opacity: headerTabViewTranslateY.interpolate({
            inputRange: [-80, 0],
            outputRange: [0.5, 0],
          }),
        }}
      />
      <HeaderTabWrapper>
        <Animated.View style={headerTabViewStyle}>
          <HeaderTab value={value} onChange={onChange}>
            {items}
          </HeaderTab>
        </Animated.View>
      </HeaderTabWrapper>
      {!!children && children({
        onScroll,
        contentInset: { top: 80 },
        contentInsetAdjustmentBehavior: "always",
      })}
    </View>
  )
}
