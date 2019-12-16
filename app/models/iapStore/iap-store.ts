/* eslint-disable @typescript-eslint/interface-name-prefix */
import RNIap, {
  Product,
  Purchase,
  PurchaseError,
} from "react-native-iap"

import { Instance, SnapshotOut, flow, types, getEnv } from "mobx-state-tree"
import { observable } from "mobx"
import { Platform, Alert } from "react-native"
import { Environment } from "../environment"
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
  .extend(self => {
    const env: Environment = getEnv(self)

    const purchasedSKUs = observable.set(new Set<string>())
    const products = observable.box(Array<Product>(0))
    const isFetchingProducts = observable.box(false)
    const isRestoringPurchases = observable.box(false)

    const handlePurchaseUpdate = flow(function * (purchase: Purchase) {
      const receipt = purchase.transactionReceipt
      if (receipt) {
        // TODO: Validation on Android
        if (Platform.OS === "ios") {
          const result: any = yield RNIap.validateReceiptIos({
            "receipt-data": receipt,
            password: env.appConfig.getValue("IAP_IOS_SHARED_SECRET"),
          }, env.appConfig.getValue("IAP_IOS_IS_SANDBOX") === "true")
          if (result) {
            if (result.status === 0) {
              purchasedSKUs.add(SKU_COM_OICE_MEMBERSHIP)
              self.hasSubscription = true
            } else {
              Alert.alert(translate("error.IAP_PURCHASE_RECEIPT_ERROR"), `[${result.status}]`)
            }
          }
        }
      }
    })

    const handlePurchaseError = flow(function * (error: PurchaseError) {
      logError(error)
    })

    const fetchProducts = flow(function * () {
      isFetchingProducts.set(true)
      try {
        products.set(yield RNIap.getProducts([SKU_COM_OICE_MEMBERSHIP]))
      } catch (error) {
        logError(error)
      } finally {
        isFetchingProducts.set(false)
      }
    })

    const requestSubscription = flow(function * (sku: string) {
      try {
        yield RNIap.requestSubscription(sku, false)
      } catch (error) {
        logError(error)
      }
    })

    const restorePurchases = flow(function * () {
      isRestoringPurchases.set(true)
      try {
        const purchases: Purchase[] = yield RNIap.getAvailablePurchases()
        let hasSubscription = false
        purchases.forEach(purchase => {
          switch (purchase.productId) {
            case SKU_COM_OICE_MEMBERSHIP:
              purchasedSKUs.add(SKU_COM_OICE_MEMBERSHIP)
              hasSubscription = true
              break
          }
        })
        self.hasSubscription = hasSubscription
      } catch (error) {
        logError(error)
      } finally {
        isRestoringPurchases.set(false)
      }
    })

    function getIsPurchased(sku: string) {
      return purchasedSKUs.has(sku)
    }

    return {
      actions: {
        clear() {
          purchasedSKUs.clear()
          self.hasSubscription = false
        },
        fetchProducts,
        handlePurchaseUpdate,
        handlePurchaseError,
        requestSubscription,
        restorePurchases,
      },
      views: {
        getIsPurchased,
        get isSubscribedOiceMemebership() {
          return getIsPurchased(SKU_COM_OICE_MEMBERSHIP)
        },
        get products() {
          return products.get()
        },
        get isEnabled() {
          return env.appConfig.getValue("IAP_ENABLE") === "true"
        },
        get isFetchingProducts() {
          return isFetchingProducts.get()
        },
        get isRestoringPurchases() {
          return isRestoringPurchases.get()
        },
      },
    }
  })

type IAPStoreType = Instance<typeof IAPStoreModel>
export interface IAPStore extends IAPStoreType {}
type IAPStoreSnapshotType = SnapshotOut<typeof IAPStoreModel>
export interface IAPStoreSnapshot extends IAPStoreSnapshotType {}
