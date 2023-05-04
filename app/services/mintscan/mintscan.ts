/**
 * A Mintscan helper
 */
export class Mintscan {
  /**
   * The base URL of the Mintscan
   */
  baseURL = ""

  setup(baseURL = "") {
    this.baseURL = baseURL
  }

  /**
   * Get the URL to account page of Mintscan by address
   *
   * @param address The Cosmos address
   */
  getAccountURL(address: string) {
    return `${this.baseURL}/account/${address}`
  }

  getValidatorURL(address: string) {
    return `${this.baseURL}/validators/${address}`
  }

  getTransactionURL(hash: string) {
    if (!hash) return ""
    return `${this.baseURL}/txs/${hash}`
  }
}
