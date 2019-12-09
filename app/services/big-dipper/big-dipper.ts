/**
 * A Big Dipper helper
 */
export class BigDipper {
  /**
   * The base URL of the Big Dipper
   */
  baseURL: string = ""

  setup(baseURL: string = "") {
    this.baseURL = baseURL
  }

  /**
   * Get the URL to account page of Big Dipper by address
   *
   * @param address The Cosmos address
   */
  getAccountURL(address: string) {
    return `${this.baseURL}/account/${address}`
  }

  getValidatorURL(address: string) {
    return `${this.baseURL}/validator/${address}`
  }

  getTransactionURL(hash: string, isNew: boolean = true) {
    if (!hash) return ""
    return `${this.baseURL}/transactions/${hash}${isNew ? "?new" : ""}`
  }
}
