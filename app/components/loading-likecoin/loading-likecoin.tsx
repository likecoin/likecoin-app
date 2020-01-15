import * as React from "react"
import {
  Animated,
  Easing,
  ViewProps,
  ViewStyle,
} from "react-native"

import { Icon } from "../icon"

const ROOT: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

export class LoadingLikeCoin extends React.PureComponent<ViewProps> {
  state = {
    fillAnim: new Animated.Value(0.25),
  }

  animation = Animated.loop(
    Animated.sequence([
      Animated.timing(
        this.state.fillAnim,
        {
          toValue: 1,
          easing: Easing.linear,
          duration: 750,
        }
      ),
      Animated.timing(
        this.state.fillAnim,
        {
          toValue: 0.25,
          easing: Easing.linear,
          duration: 750,
        }
      )
    ])
  )

  componentDidMount() {
    this.animation.start()
  }

  componentWillUnmount() {
    this.animation.stop()
  }

  render() {
    const { style, ...restProps } = this.props
    const rootStyle = [
      ROOT,
      style,
      { opacity: this.state.fillAnim } as any as ViewStyle,
    ]
    return (
      <Animated.View
        {...restProps}
        style={rootStyle}
      >
        <Icon
          name="like-clap"
          width={72}
          height={72}
          color="white"
        />
      </Animated.View>
    )
  }
}
