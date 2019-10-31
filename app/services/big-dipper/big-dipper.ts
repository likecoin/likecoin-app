import { BIG_DIPPER_URL } from "react-native-dotenv"

/**
 * A Big Dipper helper
 */
export class BigDipper {
  /**
   * Get the URL to account page of Big Dipper by address
   *
   * @param address The Cosmos address
   */
  static getAccountURL(address: string) {
    return `${BIG_DIPPER_URL}/account/${address}`
  }

  static getValidatorURL(address: string) {
    return `${BIG_DIPPER_URL}/validator/${address}`
  }

  static getTransactionURL(hash: string) {
    return `${BIG_DIPPER_URL}/transactions/${hash}`
  }
}
