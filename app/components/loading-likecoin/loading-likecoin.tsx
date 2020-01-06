import * as React from "react"
import { Animated, ViewStyle, Easing } from "react-native"

import { Icon } from "../icon"

export class LoadingLikeCoin extends React.PureComponent {
  state = {
    fillAnim: new Animated.Value(0.25),
  }

  componentDidMount() {
    Animated.loop(
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
    ).start()
  }

  render() {
    const style = { opacity: this.state.fillAnim } as any as ViewStyle
    return (
      <Animated.View style={style}>
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
