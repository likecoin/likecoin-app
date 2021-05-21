import * as React from "react"
import { Animated, StyleSheet } from "react-native"
import { inject, observer } from "mobx-react"
import { NavigationScreenProps } from "react-navigation"
import styled from "styled-components/native"

import { UserStore } from "../../models/user-store"
import { SupportersStore } from "../../models/supporters-store"

import { Header } from "../../components/header"
import { HeaderTab, HeaderTabItem } from "../../components/header-tab"
import { Screen as UnstyledScreen } from "../../components/screen"
import { SponsorLinkCTATableView as UnstyledSponsorLinkCTATableView } from "../../components/sponsor-link-cta-table-view"
import { SupporterListItem } from "../../components/supporter-list-item"
import { TableView } from "../../components/table-view/table-view"

export interface FansDashoardScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
  supportersStore: SupportersStore
}

const Screen = styled(UnstyledScreen)`
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`
const ScrollViewContainer = styled.View`
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

const ScrollView = styled(Animated.ScrollView)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.secondary};
`

const SupporterList = styled(TableView)`
  margin: ${({ theme }) => theme.spacing.lg};
`

const SponsorLinkCTATableView = styled(UnstyledSponsorLinkCTATableView)`
  margin: ${({ theme }) => theme.spacing.lg};
`

@inject(
  "userStore",
  "supportersStore"
)
@observer
export class FansDashoardScreen extends React.Component<FansDashoardScreenProps, {}> {
  state = {
    scrollY: new Animated.Value(0),
  }

  componentDidMount() {
    this.props.supportersStore.fetch()
  }

  private onPressBack = () => {
    this.props.navigation.goBack()
  }

  render () {
    const handleScroll = Animated.event([
      {
        nativeEvent: {
          contentOffset: {
            y: this.state.scrollY,
          },
        },
      },
    ], { useNativeDriver: true })
    
    const headerTabViewStyle = {
      transform: [
        {
          translateY: Animated.multiply(
            Animated.diffClamp(
              this.state.scrollY.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 0, 1],
              }),
              0,
              80
            ),
            -1
          ),
        },
      ]
    }

    return (
      <Screen preset="fixed">
        <Header
          headerText={this.props.userStore.currentUser.displayName}
          leftIcon="arrow-left"
          onLeftPress={this.onPressBack}
        />
        <ScrollViewContainer>
          <HeaderTabShadow
            style={{
              opacity: this.state.scrollY.interpolate({
                inputRange: [0, 10, 11, 89.99, 90],
                outputRange: [0, 0.5, 0.5, 0.5, 0],
              }),
            }}
          />
          <HeaderTabWrapper>
            <Animated.View style={headerTabViewStyle}>
              <HeaderTab value="supporters">
                <HeaderTabItem
                  value="supporters"
                  title={`${this.props.supportersStore.items.length}`}
                  subtitleTx="fan_dashboard_screen_tab_supporter_title"
                />
              </HeaderTab>
            </Animated.View>
          </HeaderTabWrapper>
          <ScrollView
            contentInset={{ top: 80 }}
            contentInsetAdjustmentBehavior="always"
            onScroll={handleScroll}
          >
            <SupporterList>
              {this.props.supportersStore.items.map(item => (
                <SupporterListItem
                  key={item.likerID}
                  item={item}
                />
              ))}
            </SupporterList>
            <SponsorLinkCTATableView likerID="ckxpress" />
          </ScrollView>
        </ScrollViewContainer>
      </Screen>
    )
  }
}
