import * as React from "react"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"

import { logAnalyticsEvent } from "../../utils/analytics"

import { ChainStore } from "../../models/chain-store"
import { Validator } from "../../models/validator"

import { Header } from "../../components/header"
import { HeaderTabItem } from "../../components/header-tab"
import { HeaderTabContainerView } from "../../components/header-tab-container-view"
import { Screen as ScreenBase } from "../../components/screen"
import {
  ValidatorList as ValidatorListBase,
  ValidatorListFilter,
} from "../../components/validator-list"

import { ValidatorListScreenProps as Props } from "."

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const ValidatorList = styled(ValidatorListBase)`
  background-color: ${({ theme }) => theme.color.background.secondary};
  padding: 0 ${({ theme }) => theme.spacing.xs};
`

@inject((allStores: any) => ({
  chain: allStores.chainStore as ChainStore,
}))
@observer
export class ValidatorListScreen extends React.Component<Props> {
  state = {
    tabValue: "active" as ValidatorListFilter,
  }

  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressValidator = (validator: Validator) => {
    logAnalyticsEvent('ValidatorListClickValidator', { validator: validator.moniker })
    this.props.navigation.navigate("Validator", {
      validator,
    })
  }

  private onTabChange = (value: string) => {
    this.setState({ tabValue: value })
  }

  render () {
    return (
      <Screen preset="fixed">
        <Header
          headerTx="ValidatorListScreen.Title"
          leftIcon="arrow-left"
          onLeftPress={this.onPressCloseButton}
        />
        <HeaderTabContainerView
          value={this.state.tabValue}
          items={[
            <HeaderTabItem
              key="active"
              value="active"
              title={`${this.props.chain?.activeValidatorsList?.length || 0}`}
              subtitleTx="validatorScreen.Status.Active"
            />,
            <HeaderTabItem
              key="inactive"
              value="inactive"
              title={`${this.props.chain?.inactiveValidatorsList?.length || 0}`}
              subtitleTx="validatorScreen.Status.Inactive"
            />
          ]}
          onChange={this.onTabChange}
        >
          {(props) => (
            <ValidatorList
              {...props}
              filter={this.state.tabValue}
              isScrolling={true}
              chain={this.props.chain}
              onPressItem={this.onPressValidator}
            />
          )}
        </HeaderTabContainerView>
      </Screen>
    )
  }
}
