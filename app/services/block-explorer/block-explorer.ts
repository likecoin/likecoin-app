/**
 * A block explorer helper
 */
export class BlockExplorer {
  /**
   * The account URL of the block explorer
   */
  accountBaseURL = ""

  /**
   * The validator URL of the block explorer
   */
  validatorBaseURL = ""

  /**
   * The tx URL of the block explorer
   */
  transactionBaseURL = ""

  setup({
    accountBaseURL,
    validatorBaseURL,
    transactionBaseURL,
  }) {
    this.accountBaseURL = accountBaseURL
    this.validatorBaseURL = validatorBaseURL
    this.transactionBaseURL = transactionBaseURL
  }

  /**
   * Get the URL to account page of block explorer by address
   *
   * @param address The Cosmos address
   */
  getAccountURL(address: string) {
    return `${this.accountBaseURL}/account/${address}`
  }

  getValidatorURL(address: string) {
    return `${this.validatorBaseURL}/staking/${address}`
  }

  getTransactionURL(hash: string) {
    if (!hash) return ""
    return `${this.transactionBaseURL}/tx/${hash}`
  }
}
