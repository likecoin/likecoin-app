import * as React from "react"
import { Animated } from "react-native"
import { inject, observer } from "mobx-react"
import { NavigationScreenProps } from "react-navigation"
import styled from "styled-components/native"

import { UserStore } from "../../models/user-store"
import { SupportersStore } from "../../models/supporters-store"

import { Header } from "../../components/header"
import { HeaderTabContainerView } from "../../components/header-tab-container-view"
import { HeaderTabItem } from "../../components/header-tab"
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
  componentDidMount() {
    this.props.supportersStore.fetch()
  }

  private onPressBack = () => {
    this.props.navigation.goBack()
  }

  render () {
    return (
      <Screen preset="fixed">
        <Header
          headerText={this.props.userStore.currentUser.displayName}
          leftIcon="arrow-left"
          onLeftPress={this.onPressBack}
        />
        <HeaderTabContainerView
          value="supporters"
          items={(
            <HeaderTabItem
              value="supporters"
              title={`${this.props.supportersStore.items.length}`}
              subtitleTx="fan_dashboard_screen_tab_supporter_title"
            />
          )}
        >
          {props => (
            <ScrollView {...props}>
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
          )}
        </HeaderTabContainerView>
      </Screen>
    )
  }
}
