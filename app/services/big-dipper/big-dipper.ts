/**
 * A Big Dipper helper
 */
export class BigDipper {
  constructor(BIG_DIPPER_URL: string) {
    this.BIG_DIPPER_URL = BIG_DIPPER_URL
  }

  /**
   * Get the URL to account page of Big Dipper by address
   *
   * @param address The Cosmos address
   */
  getAccountURL(address: string) {
    return `${this.BIG_DIPPER_URL}/account/${address}`
  }

  getValidatorURL(address: string) {
    return `${this.BIG_DIPPER_URL}/validator/${address}`
  }

  getTransactionURL(hash: string) {
    if (!hash) return ""
    return `${this.BIG_DIPPER_URL}/transactions/${hash}`
  }
}
