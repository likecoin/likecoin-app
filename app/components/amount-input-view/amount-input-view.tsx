import * as React from "react"
import {
  LayoutChangeEvent,
  View,
} from "react-native"
import BigNumber from "bignumber.js"
import styled from "styled-components/native"

import { color } from "../../theme"

import { AmountInputPad } from "../amount-input-pad"
import { Button } from "../button"
import CivicLikerV3ControlledSummaryViewBase from "../civic-liker-v3/controlled-summary-view"
import { Screen } from "../screen"
import { Sheet } from "../sheet"
import { Text } from "../text"

import { AmountInputViewProps } from "./amount-input-view.props"
import STYLE from "./amount-input-view.style"

const CivicLikerV3ControlledSummaryView = styled(CivicLikerV3ControlledSummaryViewBase)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export class AmountInputView extends React.Component<AmountInputViewProps, {}> {
  state = {
    maxAmountLabelWidth: 0
  }

  private formatAmount = (amount: BigNumber) => {
    const { formatAmount } = this.props
    if (formatAmount) {
      return formatAmount(amount)
    }
    return amount.toFixed()
  }

  private onLayoutMaxAmountView = (event: LayoutChangeEvent) => {
    this.setState({
      maxAmountLabelWidth: event.nativeEvent.layout.width,
    })
  }

  private onPressCloseButton = () => {
    if (this.props.onClose) this.props.onClose()
  }

  private onAmountInputChange = (amount: string) => {
    if (this.props.onChange) this.props.onChange(amount)
  }

  private onPressMaxButton = () => {
    if (this.props.onChange) {
      this.props.onChange(this.props.maxAmount)
    }
  }

  private onPressFinishButton = () => {
    const {
      amount,
      maxAmount,
      onErrorExceedMax,
      onErrorLessThanZero,
    } = this.props
    if (amount.isZero()) {
      if (onErrorLessThanZero) onErrorLessThanZero()
      return
    }

    if (amount.isGreaterThan(maxAmount)) {
      if (onErrorExceedMax) onErrorExceedMax()
      return
    }

    if (this.props.onClose) this.props.onConfirm()
  }

  render () {
    const { value, error, civicLikerStakingPreset } = this.props
    return (
      <Screen
        preset="scroll"
        backgroundColor={color.palette.likeGreen}
        style={STYLE.SCREEN}
      >
        {!!civicLikerStakingPreset && (
          <CivicLikerV3ControlledSummaryView
            preset={civicLikerStakingPreset}
            prepend={(
              <View style={STYLE.TOP_NAVIGATION}>
                <Button
                  preset="icon"
                  icon="close"
                  color="likeGreen"
                  onPress={this.onPressCloseButton}
                />
              </View>
            )}
          />
        )}
        <Sheet style={civicLikerStakingPreset ? STYLE.SHEET : null}>
          {!civicLikerStakingPreset && (
            <View style={STYLE.TOP_NAVIGATION}>
              <Button
                preset="icon"
                icon="close"
                color="likeGreen"
                onPress={this.onPressCloseButton}
              />
            </View>
          )}
          <View style={STYLE.CONTENT_VIEW}>
            {this.renderHeader()}
            <AmountInputPad
              value={value}
              errorText={error}
              style={STYLE.AMOUNT_INPUT_PAD}
              isShowMaxButton={this.props.isShowMaxButton}
              maxButtonTitle={this.props.maxButtonTitle}
              onPressMax={this.onPressMaxButton}
              onChange={this.onAmountInputChange}
            />
          </View>
          <View style={STYLE.BOTTOM_NAVIGATION}>
            <Button
              tx={this.props.confirmButtonTx}
              style={STYLE.DONE_BUTTON}
              isLoading={this.props.isConfirmButtonLoading}
              onPress={this.onPressFinishButton}
            />
          </View>
        </Sheet>
      </Screen>
    )
  }

  private renderHeader = () => {
    const { maxAmount } = this.props
    const textStyle = [
      STYLE.AVAILABLE_AMOUNT,
      {
        width: this.state.maxAmountLabelWidth,
      },
    ]
    return (
      <View style={STYLE.HEADER}>
        <View
          style={STYLE.AVAILABLE_ROOT}
          onLayout={this.onLayoutMaxAmountView}
        >
          <Text
            text={this.formatAmount(maxAmount)}
            weight="600"
            minimumFontScale={0.5}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={textStyle}
          />
          {this.props.availableLabelTx && (
            <Text tx={this.props.availableLabelTx} />
          )}
        </View>
        {this.renderGraph()}
      </View>
    )
  }

  private renderGraph = () => {
    const { graph } = this.props
    return !!graph && React.cloneElement(graph, {
      width: STYLE.GRAPH.width,
      height: STYLE.GRAPH.height,
      fill: color.palette.likeGreen,
      style: STYLE.GRAPH,
    })
  }
}
