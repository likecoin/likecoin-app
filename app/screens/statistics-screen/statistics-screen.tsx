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

import { Header } from "../../components/header"
import { ReferralCTA } from "../../components/referral-cta"
import { Screen } from "../../components/screen"

import { color } from "../../theme"
import { logAnalyticsEvent } from "../../utils/analytics"

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

    onPressReferralCTA = () => {
      this.props.navigation.navigate("Referral")
      logAnalyticsEvent("StatisticsClickReferralCTA")
    }

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
            {this.renderReferralCTA()}
          </View>
        </Screen>
      )
    }

    renderReferralCTA = () => (
      <Animated.View
        style={[
          Style.ReferralCTA,
          {
            transform: [
              {
                translateY: this.state.scrollY.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ],
          },
        ]}
      >
        <ReferralCTA onPressAction={this.onPressReferralCTA} />
      </Animated.View>
    )

    renderSeparator = () => (
      <View style={Style.SeparatorWrapper}>
        <View style={Style.Separator} />
      </View>
    )
  }
}
