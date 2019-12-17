/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Platform, Alert } from "react-native"
import RNIap, {
  Product,
  Purchase,
  PurchaseError,
} from "react-native-iap"

import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { withEnvironment } from "../extensions"
import { translate } from "../../i18n"
import { logError } from "../../utils/error"

const SKU_COM_OICE_MEMBERSHIP = "com.oice.membership"

/**
 * Store IAP related information.
 */
export const IAPStoreModel = types
  .model("IAPStore")
  .props({
    hasSubscription: types.optional(types.boolean, false),
  })
  .volatile(() => ({
    purchasedSKUs: new Set<string>(),
    products: Array<Product>(0),
    isFetchingProducts: false,
    isRestoringPurchases: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get isEnabled() {
      return self.getConfig("IAP_ENABLE") === "true"
    },
    getIsPurchased(sku: string) {
      return self.purchasedSKUs.has(sku)
    },
    get isSubscribedOiceMemebership() {
      return this.getIsPurchased(SKU_COM_OICE_MEMBERSHIP)
    },
  }))
  .actions(self => ({
    clear() {
      self.purchasedSKUs.clear()
      self.hasSubscription = false
    },
    handlePurchaseUpdate: flow(function * (purchase: Purchase) {
      const receipt = purchase.transactionReceipt
      if (receipt) {
        // TODO: Validation on Android
        if (Platform.OS === "ios") {
          const result: any = yield RNIap.validateReceiptIos({
            "receipt-data": receipt,
            password: self.getConfig("IAP_IOS_SHARED_SECRET"),
          }, self.getConfig("IAP_IOS_IS_SANDBOX") === "true")
          if (result) {
            if (result.status === 0) {
              self.purchasedSKUs.add(SKU_COM_OICE_MEMBERSHIP)
              self.hasSubscription = true
            } else {
              Alert.alert(translate("error.IAP_PURCHASE_RECEIPT_ERROR"), `[${result.status}]`)
            }
          }
        }
      }
    }),
    handlePurchaseError: flow(function * (error: PurchaseError) {
      logError(error)
    }),
    fetchProducts: flow(function * () {
      self.isFetchingProducts = true
      try {
        self.products = yield RNIap.getProducts([SKU_COM_OICE_MEMBERSHIP])
      } catch (error) {
        logError(error)
      } finally {
        self.isFetchingProducts = false
      }
    }),
    requestSubscription: flow(function * (sku: string) {
      try {
        yield RNIap.requestSubscription(sku, false)
      } catch (error) {
        logError(error)
      }
    }),
    restorePurchases: flow(function * () {
      self.isRestoringPurchases = true
      try {
        const purchases: Purchase[] = yield RNIap.getAvailablePurchases()
        let hasSubscription = false
        purchases.forEach(purchase => {
          switch (purchase.productId) {
            case SKU_COM_OICE_MEMBERSHIP:
              self.purchasedSKUs.add(SKU_COM_OICE_MEMBERSHIP)
              hasSubscription = true
              break
          }
        })
        self.hasSubscription = hasSubscription
      } catch (error) {
        logError(error)
      } finally {
        self.isRestoringPurchases = false
      }
    }),
  }))

type IAPStoreType = Instance<typeof IAPStoreModel>
export interface IAPStore extends IAPStoreType {}
type IAPStoreSnapshotType = SnapshotOut<typeof IAPStoreModel>
export interface IAPStoreSnapshot extends IAPStoreSnapshotType {}
