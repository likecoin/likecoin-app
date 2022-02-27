import * as React from "react"
import { inject, observer } from "mobx-react"
import { ViewStyle } from "react-native"

import { ChainStore } from "../../models/chain-store"
import { CivicLikerStakingStore } from "../../models/civic-liker-staking-store"
import { Validator } from "../../models/validator"

import { SheetPresetType } from "../sheet"

import { CivicLikerV3SummaryView } from "./summary-view"

interface CivicLikerV3ControlledSummaryViewProps {
  chainStore?: ChainStore
  civicLikerStakingStore?: CivicLikerStakingStore
  preset?: string
  prepend?: React.ReactNode
  sheetPreset?: SheetPresetType
  style?: ViewStyle
  onPressButton?: (validator: Validator) => void
}

@inject("chainStore", "civicLikerStakingStore")
@observer
class CivicLikerV3ControlledSummaryView extends React.Component<CivicLikerV3ControlledSummaryViewProps> {
  componentDidMount(): void {
    this.props.civicLikerStakingStore.fetch()
  }

  get validator() {
    return this.props.chainStore.validators.get(this.props.civicLikerStakingStore.validatorAddress)
  }

  private handleButtonPress = () => {
    this.props.onPressButton(this.validator)
  }

  render(): React.ReactNode {
    const {
      status,
      stakingAmount,
      stakingAmountTarget,
    } = this.props.civicLikerStakingStore
    return (
      <CivicLikerV3SummaryView
        preset={this.props.preset}
        validatorName={this.validator?.moniker || ""}
        status={status}
        stakingAmount={stakingAmount}
        stakingAmountTarget={stakingAmountTarget}
        prepend={this.props.prepend}
        sheetPreset={this.props.sheetPreset}
        style={this.props.style}
        onPressButton={this.handleButtonPress}
      />
    )
  }
}

export default CivicLikerV3ControlledSummaryView
