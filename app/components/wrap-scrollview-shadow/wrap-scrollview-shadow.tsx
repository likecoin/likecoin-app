import * as React from "react"
import { Animated, View } from "react-native"

import { WrapScrollViewShadowProps as Props } from "./wrap-scrollview-shadow.props"
import { WrapScrollViewShadowStyle as Style } from "./wrap-scrollview-shadow.style"

export const wrapScrollViewShadow = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component<P & Props> {
    state = {
      scrollY: new Animated.Value(0),
    }

    render() {
      const { style, ...props } = this.props
      return (
        <View style={[Style.Root, style]}>
          <WrappedComponent
            {...(props as P)}
            style={Style.WrappedComponent}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.state.scrollY,
                  },
                },
              },
            ])}
          />
          <Animated.View
            style={[
              Style.Shadow,
              {
                opacity: this.state.scrollY.interpolate({
                  inputRange: [0, 10, 11],
                  outputRange: [0, 0.5, 0.5],
                }),
              },
            ]}
          />
        </View>
      )
    }
  }
}
