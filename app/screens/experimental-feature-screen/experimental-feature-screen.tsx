import * as React from "react"
import { Switch } from "react-native"
import { inject, observer } from "mobx-react"
import { NavigationTabScreenProps } from "react-navigation-tabs"
import styled from "styled-components/native"

import { Header } from "../../components/header"
import { TableView , TableViewCell } from "../../components/table-view"

import { Screen as ScreenBase } from "../../components/screen"

import { ExperimentalFeatureStore } from "../../models/experimental-feature-store"

import { color } from "../../theme"

const Screen = styled(ScreenBase)`
  flex: 1;
`

const ScrollView = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.secondary};
`

const ScrollContentView = styled.View`
  padding-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
`

export interface ExperimentalFeatureScreenProps extends NavigationTabScreenProps<{}> {
  experimentalFeatureStore: ExperimentalFeatureStore
}

@inject("experimentalFeatureStore")
@observer
export class ExperimentalFeatureScreen extends React.Component<ExperimentalFeatureScreenProps, {}> {
  private goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
      >
        <Header
          headerTx="experimental_feature_screen_title"
          leftIcon="back"
          onLeftPress={this.goBack}
        />
        <ScrollView>
          <ScrollContentView>
            <TableView>
              <TableViewCell
                titleTx="experimental_feature_wallet_connect_title"
                prepend={(
                  <Switch
                    trackColor={{ true: color.primary, false: color.palette.grey9b }}
                    onValueChange={this.props.experimentalFeatureStore.setIsWalletConnectEnabled}
                    value={this.props.experimentalFeatureStore.isWalletConnectEnabled}
                  />
                )}
              />
            </TableView>
          </ScrollContentView>
        </ScrollView>
      </Screen>
    )
  }
}
