/**
 * A Big Dipper helper
 */
export class BigDipper {
  /**
   * The base URL of the Big Dipper
   */
  baseURL = ""

  setup(baseURL = "") {
    this.baseURL = baseURL
  }

  /**
   * Get the URL to account page of Big Dipper by address
   *
   * @param address The Cosmos address
   */
  getAccountURL(address: string) {
    return `${this.baseURL}/accounts/${address}`
  }

  getValidatorURL(address: string) {
    return `${this.baseURL}/validators/${address}`
  }

  getTransactionURL(hash: string, isNew = true) {
    if (!hash) return ""
    return `${this.baseURL}/transactions/${hash}${isNew ? "?new" : ""}`
  }
}
