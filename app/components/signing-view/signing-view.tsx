import * as React from "react"
import { Image, View } from "react-native"

import { SigningViewProps, SigningViewEntity } from "./signing-view.props"
import STYLE, { DETAIL, SHEET, SUMMARY } from "./signing-view.style"

import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"

import { color } from "../../theme"

import { Icon } from "../icon"

export class SigningView extends React.Component<SigningViewProps, {}> {
  state = {
    isShowDetail: false,
  }

  private onPressCloseButton = () => {
    if (this.props.onClose) this.props.onClose()
  }

  private onPressDetailToggleButton = () => {
    this.setState({ isShowDetail: !this.state.isShowDetail })
  }

  private onPressConfirmButton = () => {
    if (this.props.onConfirm) this.props.onConfirm()
  }

  render () {
    const {
      error,
      state,
      txURL,
    } = this.props
    return (
      <Screen
        preset="scroll"
        backgroundColor={color.palette.likeGreen}
        style={STYLE.SCREEN}
      >
        <View style={STYLE.TOP_NAVIGATION}>
          <Button
            preset="icon"
            icon="close"
            color="white"
            isHidden={state !== "waiting"}
            onPress={this.onPressCloseButton}
          />
        </View>
        <View style={STYLE.BODY}>
          <Text
            tx="transferSigningScreen.completed"
            color="likeCyan"
            size="medium"
            weight="600"
            isHidden={state !== "success"}
            style={STYLE.COMPLETED_LABEL}
          />
          {!!error &&
            <Sheet style={[SHEET.ROOT, STYLE.ERROR]}>
              <Text
                text={error}
                size="medium"
                weight="600"
                color="angry"
              />
            </Sheet>
          }
          <Sheet
            isZeroPaddingBottom
            style={SHEET.ROOT}
          >
            {this.renderSummary()}
            {this.props.type !== "reward" && this.renderDetail()}
          </Sheet>
          <Button
            preset="outlined"
            tx="common.viewOnBlockExplorer"
            link={txURL}
            color="likeCyan"
            fontSize="default"
            isHidden={!txURL}
            style={STYLE.BLOCK_EXPLORER_BUTTON}
          />
        </View>
        <View style={STYLE.BOTTOM_NAVIGATION}>
          <Button
            tx={state === "waiting" ? "common.confirm" : "common.done"}
            isLoading={state === "pending"}
            disabled={this.props.isConfirmButtonDisabled}
            onPress={this.onPressConfirmButton}
          />
          {this.props.bottomNavigationAppendChildren}
        </View>
      </Screen>
    )
  }

  private renderGraph = () => {
    const { graph, graphStyle = {} } = this.props
    return !!graph && React.cloneElement(graph, {
      width: SUMMARY.GRAPH.width,
      height: SUMMARY.GRAPH.height,
      fill: color.palette.likeGreen,
      style: [SUMMARY.GRAPH, graphStyle],
    })
  }

  private renderSummary = () => {
    const {
      type,
      titleTx,
      amount,
      fee,
      from,
      target,
    } = this.props
    return (
      <View style={SHEET.SECTION}>
        <View style={SUMMARY.HEADER}>
          {this.renderGraph()}
          <Text
            tx={titleTx}
            align="center"
            weight="600"
            style={SUMMARY.HEADER_TITLE}
          />
        </View>
        <View style={SUMMARY.BODY}>
          <View style={SUMMARY.AMOUNT}>
            <Text
              text={amount}
              size="large"
              weight="600"
              color={type === "reward" ? "green" : "grey4a"}
              minimumFontScale={0.5}
              numberOfLines={1}
              adjustsFontSizeToFit
            />
          </View>
          {type === "reward" ? (
            <View style={SUMMARY.ENTITY}>
              <Text
                text={fee}
                size="large"
                weight="600"
                minimumFontScale={0.5}
                numberOfLines={1}
                adjustsFontSizeToFit
              />
              <Text
                tx="transaction.fee"
                style={STYLE.LABEL}
              />
            </View>
          ) : (from || target ? (
            <View style={SUMMARY.ENTITY_CONTAINER}>
              {!!from &&
                <View style={SUMMARY.ENTITY}>
                  <Text
                    tx={"transaction.from"}
                    style={STYLE.LABEL}
                  />
                  {this.renderEntity(from)}
                </View>
              }
              {!!target &&
                <View style={SUMMARY.ENTITY}>
                  <Text
                    tx={"transaction.to"}
                    style={STYLE.LABEL}
                  />
                  {this.renderEntity(target)}
                </View>
              }
            </View>
          ) : null)}
        </View>
      </View>
    )
  }

  private renderEntity = (entity: SigningViewEntity) => {
    if (typeof entity === "string") {
      const { isShowDetail } = this.state
      return <Text
        text={entity}
        numberOfLines={isShowDetail ? null : 1}
        ellipsizeMode={isShowDetail ? null : "middle"}
      />
    }
    const { avatar: uri, name } = entity
    return (
      <View style={SUMMARY.ENTITY_WITH_AVATAR}>
        <Image
          source={{ uri }}
          style={SUMMARY.ENTITY_AVATAR}
        />
        <Text
          text={name}
          size="default"
          weight="500"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={SUMMARY.ENTITY_NAME}
        />
      </View>
    )
  }

  private renderDetail = () => {
    const {
      fee,
      memo,
      totalAmount,
    } = this.props
    const { isShowDetail } = this.state
    return (
      <View style={DETAIL.CONTAINER}>
        <Button
          preset="plain"
          style={DETAIL.HEADER}
          onPress={this.onPressDetailToggleButton}
        >
          <Text
            tx="transferSigningScreen.details"
            color="likeGreen"
            weight="600"
          />
          <Icon
            color="likeGreen"
            name={isShowDetail ? "arrow-up" : "arrow-down"}
          />
        </Button>
        {isShowDetail && (
          <View style={DETAIL.BODY}>
            <View style={DETAIL.ITEM}>
              <Text
                tx="transferSigningScreen.transactionFee"
                style={STYLE.LABEL}
              />
              <Text text={fee} weight="600" />
            </View>
            {!!totalAmount && (
              <View style={DETAIL.ITEM}>
                <Text
                  tx="transferSigningScreen.totalAmount"
                  style={STYLE.LABEL}
                />
                <Text text={totalAmount} weight="600" />
              </View>
            )}
            {!!memo && (
              <View style={DETAIL.ITEM}>
                <Text
                  tx="transferSigningScreen.Memo"
                  style={STYLE.LABEL}
                />
                <Text text={memo} weight="600" />
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}
