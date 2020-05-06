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
    limit: 0,
  } as Partial<Props>

  private onPressItem = (validator: Validator) => {
    this.props.onPressItem && this.props.onPressItem(validator)
  }

  private filterList = (validator: Validator) => {
    // Filter out inactive validator in short list
    if (this.props.limit > 0 && !validator.isActive) {
      return false
    }
    return !this.props.excluded.includes(validator.operatorAddress)
  }

  render() {
    const list = this.props.chain?.sortedValidatorList || []
    const { limit } = this.props
    return (
      <View style={this.props.style}>
        {(
          limit > 0
            ? list.filter(this.filterList).slice(0, limit)
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
