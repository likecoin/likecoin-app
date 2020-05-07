import * as React from "react"
import {
  Dimensions,
  LayoutChangeEvent,
  View,
  Animated,
} from "react-native"

import {
  StatisticsScreenStyle as Style,
} from "./statistics-screen.style"
import {
  StatisticsScreenWrapperProps as Props,
} from "./statistics-screen.props"

import { Screen } from "../../components/screen"
import { Header } from "../../components/header"

import { color } from "../../theme"

export const wrapStatisticsScreenBase = <P extends object>(WrappedComponent: React.ComponentType<P>, titleTx: string) => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component<P & Props> {
    state = {
      carouselWidth: Dimensions.get("window").width,
      scrollY: new Animated.Value(0),
    }

    componentDidMount() {
      this.props.dataStore.deselectDayOfWeek()
    }

    skeletonListItemKeyExtractor =
      (_: any, index: number) => `${index}`

    onPressBack = () => {
      this.props.navigation.goBack()
    }

    onLayoutCarousel = (event: LayoutChangeEvent) => {
      this.setState({ sliderWidth: event.nativeEvent.layout.width })
    }

    onScrollDashboard = () => {
      if (this.props.dataStore.hasSelectedDayOfWeek) {
        this.props.dataStore.deselectDayOfWeek()
      }
    }

    onSelectDay = (dayOfWeek: number) => {
      this.props.dataStore.selectDayOfWeek(dayOfWeek)
    }

    onScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              y: this.state.scrollY,
            },
          },
        },
      ]
    )

    render() {
      return (
        <Screen
          preset="fixed"
          backgroundColor={color.transparent}
          style={Style.Screen}
        >
          <View style={Style.BackdropWrapper}>
            <View style={Style.Backdrop} />
          </View>
          <Header
            headerTx={titleTx}
            leftIcon="back"
            onLeftPress={this.onPressBack}
          />
          <View style={Style.ListWrapper}>
            <WrappedComponent
              {...this.props as P}
              carouselWidth={this.state.carouselWidth}
              skeletonListItemKeyExtractor={this.skeletonListItemKeyExtractor}
              renderSeparator={this.renderSeparator}
              onLayoutCarousel={this.onLayoutCarousel}
              onScroll={this.onScroll}
              onScrollDashboard={this.onScrollDashboard}
              onSelectDay={this.onSelectDay}
            />
            <Animated.View
              style={[
                Style.ListShadow,
                {
                  opacity: this.state.scrollY.interpolate({
                    inputRange: [0, 10, 11],
                    outputRange: [0, 0.5, 0.5],
                  }),
                }
              ]}
            />
          </View>
        </Screen>
      )
    }

    renderSeparator = () => (
      <View style={Style.SeparatorWrapper}>
        <View style={Style.Separator} />
      </View>
    )
  }
}
