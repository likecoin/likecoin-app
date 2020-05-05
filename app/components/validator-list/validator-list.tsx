import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react"

import { ValidatorListItem } from "../validator-list-item"
import { ValidatorListProps as Props } from "./validator-list.props"

import { Validator } from "../../models/validator"

/**
 * Validator list
 */
@observer
export class ValidatorList extends React.Component<Props> {
  static defaultProps = {
    excluded: [],
  } as Partial<Props>

  private onPressItem = (validator: Validator) => {
    this.props.onPressItem && this.props.onPressItem(validator)
  }

  private filterList = (validator: Validator) => {
    // Filter out inactive validator in short list
    if (this.props.isShort && !validator.isActive) {
      return false
    }
    return !this.props.excluded.includes(validator.operatorAddress)
  }

  render() {
    const { sortedValidatorList: list } = this.props.chain
    return (
      <View style={this.props.style}>
        {(
          this.props.isShort
            ? list.filter(this.filterList).slice(0, 10)
            : list.filter(this.filterList)
        ).map(this.renderItem)}
      </View>
    )
  }

  private renderItem = (validator: Validator) => {
    const { formatBalance, formatRewards } = this.props.chain
    const delegation = this.props.chain.wallet.delegations.get(validator.operatorAddress)
    const delegatedAmount = formatBalance(delegation ? delegation.shares : undefined)
    const rewards = delegation && delegation.hasRewards ? formatRewards(delegation.rewards) : ""
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
}
