import * as React from "react"
import {
  Dimensions,
  LayoutChangeEvent,
  View,
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
          <WrappedComponent
            {...this.props as P}
            carouselWidth={this.state.carouselWidth}
            skeletonListItemKeyExtractor={this.skeletonListItemKeyExtractor}
            renderSeparator={this.renderSeparator}
            onLayoutCarousel={this.onLayoutCarousel}
            onScrollDashboard={this.onScrollDashboard}
            onSelectDay={this.onSelectDay}
          />
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
