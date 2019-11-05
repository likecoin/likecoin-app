import * as React from "react"
import {
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { TransferStore } from "../../models/transfer-store"
import { WalletStore } from "../../models/wallet-store"

import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { color, spacing } from "../../theme"

import TransferGraph from "../../assets/graph/transfer.svg"

import { formatLIKE } from "../../utils/number"

export interface TransferSigningScreenProps extends NavigationScreenProps<{}> {
  transferStore: TransferStore,
  walletStore: WalletStore,
}

const ROOT: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: spacing[4],
}
const TOP_BAR: ViewStyle = {
  alignItems: "flex-start",
}
const CONTENT: ViewStyle = {
  flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",
}
const BOTTOM_BAR: ViewStyle = {
  alignItems: "stretch",
  padding: spacing[4],
}
const SHEET = StyleSheet.create({
  ROOT: {
    alignItems: "stretch",
    width: 256,
  } as ViewStyle,
  SECTION: {
    padding: spacing[2],
  } as ViewStyle,
})
const COMPLETED_LABEL: TextStyle = {
  marginVertical: spacing[5],
}
const TRANSACTION = StyleSheet.create({
  AMOUNT: {
    marginTop: spacing[2],
  },
  BLOCK_EXPLORER_BUTTON: {
    marginTop: spacing[4],
    minWidth: SHEET.ROOT.width,
  },
  DETAILS: {
    backgroundColor: color.palette.lightCyan,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  DETAILS_ITEM: {
    marginTop: spacing[2],
  },
  HEADER: {
    alignItems: "center",
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomColor: color.palette.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  HEADER_ICON: {
    marginLeft: 18,
  },
  HEADER_TITLE: {
    marginTop: spacing[3],
  } as TextStyle,
  LABEL: {
    color: color.palette.grey9b,
    fontSize: sizes.default,
    paddingVertical: spacing[1],
  },
  ROOT: {
    marginHorizontal: spacing[4],
    paddingBottom: spacing[4],
    paddingTop: spacing[2],
  },
  TARGET: {
    marginTop: spacing[4],
  },
})

@inject(
  "transferStore",
  "walletStore",
)
@observer
export class TransferSigningScreen extends React.Component<TransferSigningScreenProps, {}> {
  state = {
    isSigningTransaction: false,
    isTransactionSuccess: false,
  }

  _sendTransaction = async () => {
    this.setState({ isSigningTransaction: true })
    await this.props.transferStore.signTransaction(this.props.walletStore.signer)
    const isTransactionSuccess = !this.props.transferStore.errorMessage
    this.setState({
      isSigningTransaction: false,
      isTransactionSuccess,
    })
    if (isTransactionSuccess) {
      // Update balance
      this.props.walletStore.fetchBalance()
    }
  }

  _onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  _onPressConfirmButton = () => {
    if (this.state.isTransactionSuccess) {
      this.props.navigation.dismiss()
    } else {
      this._sendTransaction()
    }
  }

  render () {
    const {
      blockExplorerURL,
    } = this.props.transferStore
    const {
      isSigningTransaction,
      isTransactionSuccess,
    } = this.state

    const shouldHideCloseButton = isSigningTransaction || isTransactionSuccess
    const confirmButtonTx = isTransactionSuccess ? "common.done" : "common.confirm"

    return (
      <Screen
        preset="scroll"
        backgroundColor={color.palette.likeGreen}
        style={ROOT}
      >
        {!shouldHideCloseButton && <View style={TOP_BAR}>
          <Button
            preset="icon"
            icon="close"
            onPress={this._onPressCloseButton}
          />
        </View>}
        <View style={CONTENT}>
          {!!isTransactionSuccess && <Text
            tx="transferSigningScreen.completed"
            color="likeCyan"
            size="medium"
            weight="600"
            style={COMPLETED_LABEL}
          />}
          {this._renderSummary()}
          {!!shouldHideCloseButton && <Button
            preset="outlined"
            tx="common.viewOnBlockExplorer"
            link={blockExplorerURL}
            color="likeCyan"
            size="default"
            style={TRANSACTION.BLOCK_EXPLORER_BUTTON}
          />}
        </View>
        <View style={BOTTOM_BAR}>
          <Button
            tx={confirmButtonTx}
            isLoading={isSigningTransaction}
            onPress={this._onPressConfirmButton}
          />
        </View>
      </Screen>
    )
  }

  _renderSummary = () => {
    const {
      amount,
      errorMessage,
      fee,
      target,
      totalAmount,
    } = this.props.transferStore

    return (
      <Sheet style={SHEET.ROOT}>
        <View style={SHEET.SECTION}>
          <View style={TRANSACTION.HEADER}>
            <TransferGraph
              width={68}
              height={50}
              fill={color.palette.likeGreen}
              style={TRANSACTION.HEADER_ICON}
            />
            <Text
              tx="transferSigningScreen.title"
              align="center"
              weight="600"
              style={TRANSACTION.HEADER_TITLE}
            />
          </View>
          <View style={TRANSACTION.ROOT}>
            {!!errorMessage &&
              <View>
                <Text
                  text={errorMessage}
                  color="angry"
                />
              </View>
            }
            <View style={TRANSACTION.AMOUNT}>
              <Text
                text={formatLIKE(amount)}
                size="large"
                weight="600"
                minimumFontScale={0.5}
                numberOfLines={1}
                adjustsFontSizeToFit
              />
            </View>
            <View style={TRANSACTION.TARGET}>
              <Text
                tx="transaction.to"
                style={TRANSACTION.LABEL}
              />
              <Text text={target} />
            </View>
          </View>
        </View>
        <View style={[SHEET.SECTION, TRANSACTION.DETAILS]}>
          <View>
            <Text
              tx="transferSigningScreen.details"
              color="likeGreen"
              weight="600"
            />
          </View>
          <View>
            <View style={TRANSACTION.DETAILS_ITEM}>
              <Text
                tx="transferSigningScreen.transactionFee"
                style={TRANSACTION.LABEL}
              />
              <Text
                text={formatLIKE(fee)}
                weight="600"
              />
            </View>
            <View style={TRANSACTION.DETAILS_ITEM}>
              <Text
                tx="transferSigningScreen.totalAmount"
                style={TRANSACTION.LABEL}
              />
              <Text
                text={formatLIKE(totalAmount)}
                weight="600"
              />
            </View>
          </View>
        </View>
      </Sheet>
    )
  }
}
