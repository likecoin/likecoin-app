import * as React from "react"
import { Animated, ListRenderItem, View } from "react-native"
import styled from "styled-components/native"
import { observer } from "mobx-react"

import { Validator } from "../../models/validator"

import { ValidatorListItem } from "../validator-list-item"

import { ValidatorListProps as Props } from "./validator-list.props"

const FlatListVerticalSpacing = styled.View`
  height: ${({ theme }) => theme.spacing.sm};
`

/**
 * Validator list
 */
@observer
export class ValidatorList extends React.Component<Props> {
  static defaultProps = {
    excluded: [],
    filter: "all",
    limit: 0,
    isScrolling: false,
  } as Partial<Props>

  private get list() {
    if (!this.props.chain) return []
    switch (this.props.filter) {
      case "active":
        return this.props.chain.activeValidatorsList

      case "inactive":
        return this.props.chain.inactiveValidatorsList
    
      case "all":
      default:
        return this.props.chain.sortedValidatorList
    }
  }

  private get items() {
    let items = this.list
    if (this.props.limit > 0) {
      items = items.slice(0, this.props.limit)
    }
    return items.filter(v => !this.props.excluded.includes(v.operatorAddress))
  }

  private onPressItem = (validator: Validator) => {
    if (this.props.onPressItem) this.props.onPressItem(validator)
  }

  private keyExtractor = (validator: Validator) => validator.operatorAddress 

  private renderItem = (validator: Validator) => {
    const { formatBalance, formatRewards } = this.props.chain
    const delegation = this.props.chain.wallet.delegations.get(validator.operatorAddress)
    const delegatedAmount = formatBalance(delegation ? delegation.balance : undefined)
    const rewards = delegation && delegation.hasDelegated && delegation.hasRewards ? formatRewards(delegation.rewards) : ""
    const hasDelegated = !!delegation && delegation.hasDelegated
    return (
      <ValidatorListItem
        key={validator.operatorAddress}
        icon={validator.avatar}
        title={validator.moniker}
        subtitle={this.props.chain.getValidatorExpectedReturnsPercentage(validator)}
        rightTitle={delegatedAmount}
        rightSubtitle={rewards}
        isDarkMode={hasDelegated}
        onPress={() => this.onPressItem(validator)}
      />
    )
  }

  private renderListItem: ListRenderItem<Validator> = ({ item }) => this.renderItem(item)

  private renderScrollView = () => {
    return (
      <Animated.FlatList<Validator>
        {...this.props}
        data={this.items}
        renderItem={this.renderListItem}
        ListHeaderComponent={FlatListVerticalSpacing}
        ListFooterComponent={FlatListVerticalSpacing}
        keyExtractor={this.keyExtractor}
      />
    )
  }

  render() {
    if (this.props.isScrolling) {
      return this.renderScrollView()
    }

    return (
      <View style={this.props.style}>
        {this.items.map(this.renderItem)}
      </View>
    )
  }
}
