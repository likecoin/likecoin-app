import * as React from "react"
import {
  Animated,
  ScrollViewProps as ReactNativeScrollViewProps,
  StyleSheet,
} from "react-native"
import styled from "styled-components/native"

const RootView = styled.View`
  flex: 1;
`

const AnimatedScrollView = styled(Animated.ScrollView)`
  flex: 1;
`

export const ScrollViewShadow = styled(Animated.View)`
  position: absolute;
  z-index: 11;
  left: 0;
  right: 0;
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.separator};
`

export interface ScrollViewProps extends ReactNativeScrollViewProps {
  isWithShadow?: boolean

  children?: React.ReactNode
}

/**
 * Scroll View with shadow tweak
 */
export function ScrollView({
  isWithShadow = false,
  children,
  onScroll: customOnScroll,
  ...props
}: ScrollViewProps) {
  const scrollY = React.useRef(new Animated.Value(0)).current

  const onScroll = Animated.event([
    {
      nativeEvent: {
        contentOffset: {
          y: scrollY,
        },
      },
    },
  ], {
    useNativeDriver: true,
    listener: customOnScroll,
  })

  const shadowStyle = {
    opacity: scrollY.interpolate({
      inputRange: [0, 10, 11],
      outputRange: [0, 0.5, 0.5],
    }),
  }

  return (
    <RootView>  
      {!!isWithShadow && <ScrollViewShadow style={shadowStyle} />}
      <AnimatedScrollView
        onScroll={onScroll}
        {...props}
      >
        {children}
      </AnimatedScrollView>
    </RootView>
  )
}
