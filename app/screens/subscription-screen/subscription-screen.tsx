import * as React from "react"
import { observer, inject } from "mobx-react"
import {
  RefreshControl,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import {
  Product as IAPProduct,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap"
import LinearGradient from 'react-native-linear-gradient'

import { Button } from "../../components/button"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { color, spacing, gradient } from "../../theme"

import { UserStore } from "../../models/user-store"
import { translate } from "../../i18n"
import { Icon } from "react-native-ui-kitten"

const CONTENT_VIEW: ViewStyle = {
  padding: spacing[4],
}
const PRODUCT_VIEW = StyleSheet.create({
  BODY: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  } as ViewStyle,
  CONTAINER: {
    backgroundColor: color.palette.white,
    borderRadius: 12,
    overflow: "hidden",
  } as ViewStyle,
  DESCRIPTION: {
    fontSize: sizes.medium,
    marginTop: spacing[2],
  } as TextStyle,
  FEATURE_LIST: {
    marginVertical: spacing[3],
    paddingRight: spacing[3],
  } as ViewStyle,
  FEATURE_LIST_BULLET: {
    width: 14,
    aspectRatio: 1,
    marginRight: spacing[2],
  } as TextStyle,
  FEATURE_LIST_ITEM: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing[1],
  } as ViewStyle,
  FOOTER: {
    borderTopColor: color.palette.lighterGrey,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row-reverse",
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
  } as ViewStyle,
  HEADER: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
  } as ViewStyle,
  PRICE: {
    fontSize: sizes.large,
    marginTop: spacing[2],
    textAlign: "right",
  },
  TITLE: {
    fontSize: 32,
    fontWeight: "600",
    color: color.primary,
  } as TextStyle,
})
const RESTORE_PURCHASE_BUTTON: ViewStyle = {
  borderColor: color.primary,
  marginTop: spacing[4],
}
const FOOTNOTE: ViewStyle = {
  marginVertical: spacing[4],
}

export interface SubscriptionScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore,
}

@inject("userStore")
@observer
export class SubscriptionScreen extends React.Component<SubscriptionScreenProps, {}> {
  purchaseErrorSubscription = undefined

  purchaseUpdateSubscription = undefined

  componentDidMount() {
    this.purchaseErrorSubscription = purchaseErrorListener(this.props.userStore.iapStore.handlePurchaseError)
    this.purchaseUpdateSubscription = purchaseUpdatedListener(this.props.userStore.iapStore.handlePurchaseUpdate)
    this.props.userStore.iapStore.fetchProducts()
  }

  componentWillUnmount() {
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove()
      this.purchaseErrorSubscription = undefined
    }
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove()
      this.purchaseUpdateSubscription = undefined
    }
  }

  private onPressBackButton = () => {
    this.props.navigation.goBack()
  }

  private onPressRestorePurchasesButton = () => {
    this.props.userStore.iapStore.restorePurchases()
  }

  render () {
    const {
      hasSubscription,
      isFetchingProducts,
      isRestoringPurchases,
      products,
    } = this.props.userStore.iapStore
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
      >
        <Header
          headerTx="subscriptionScreen.title"
          leftIcon="back"
          onLeftPress={this.onPressBackButton}
        />
        <Screen
          style={CONTENT_VIEW}
          preset="scroll"
          backgroundColor="#F2F2F2"
          unsafe
          refreshControl={
            <RefreshControl
              tintColor={color.palette.lighterCyan}
              colors={[color.primary]}
              refreshing={isFetchingProducts}
              onRefresh={this.props.userStore.iapStore.fetchProducts}
            />
          }
        >
          {products.map(this.renderProducts)}
          {!hasSubscription &&
            <Button
              preset="outlined"
              color="likeGreen"
              tx="subscriptionScreen.restorePurchasesButtonText"
              isLoading={isRestoringPurchases}
              style={RESTORE_PURCHASE_BUTTON}
              onPress={this.onPressRestorePurchasesButton}
            />
          }
          <Text
            tx="subscriptionScreen.footnote"
            color="grey9b"
            style={FOOTNOTE}
          />
        </Screen>
      </Screen>
    )
  }

  private renderProducts = (product: IAPProduct) => {
    const featureTexts: string[] = translate("subscriptionFeature")[product.productId]
    const hasPurchased = this.props.userStore.iapStore.getIsPurchased(product.productId)
    const subscribeButtonTx = `subscriptionScreen.subscribe${hasPurchased ? "d" : ""}ButtonText`
    return (
      <Sheet
        key={product.productId}
        isZeroPaddingTop
        isZeroPaddingBottom
        style={PRODUCT_VIEW.CONTAINER}
      >
        <LinearGradient
          colors={gradient.LikeCoin}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={PRODUCT_VIEW.HEADER}
        >
          <Text
            text={product.title}
            style={PRODUCT_VIEW.TITLE}
          />
          <Text
            text={product.description}
            style={PRODUCT_VIEW.DESCRIPTION}
          />
        </LinearGradient>
        <View style={PRODUCT_VIEW.BODY}>
          <View style={PRODUCT_VIEW.FEATURE_LIST}>
            {featureTexts.map((featureText, key) => (
              <View
                key={key}
                style={PRODUCT_VIEW.FEATURE_LIST_ITEM}
              >
                <Icon
                  name="checkmark-outline"
                  fill={color.palette.green}
                  style={PRODUCT_VIEW.FEATURE_LIST_BULLET}
                />
                <Text text={featureText} />
              </View>
            ))}
          </View>
          <Text
            text={product.localizedPrice}
            style={PRODUCT_VIEW.PRICE}
          />
        </View>
        <View style={PRODUCT_VIEW.FOOTER}>
          <Button
            preset="plain"
            color="likeGreen"
            disabled={hasPurchased}
            tx={subscribeButtonTx}
            onPress={() => this.props.userStore.iapStore.requestSubscription(product.productId)}
          />
        </View>
      </Sheet>
    )
  }
}
