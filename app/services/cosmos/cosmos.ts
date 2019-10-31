import Cosmos from "@lunie/cosmos-api"

import { CosmosAccountResult, CosmosValidator, CosmosMessage } from "./cosmos.types"
import { DENOM, parseCosmosLIKE } from "./cosmos.utils"

/**
 * Cosmos API helper for LikeCoin
 */
export class CosmosAPI {
  /**
   * The Cosmos API client
   */
  api: Cosmos

  constructor(restURL: string, chainId: string) {
    this.api = new Cosmos(restURL, chainId)
  }

  /**
   * Get the list of validators
   */
  async getValidators() {
    return this.api.get.validators() as CosmosValidator[]
  }

  /**
   * Get the account balance for LikeCoin
   *
   * @param address The account address
   */
  async queryBalance(address: string) {
    const account = await this.api.get.account(address) as CosmosAccountResult
    if (!account.coins.length) {
      return "0"
    }
    const [coin] = account.coins.filter(coin => coin.denom === DENOM)
    return coin.amount
  }

  /**
   * Query the annual provisioned tokens
   */
  async queryAnnualProvision() {
    return this.api.get.annualProvisionedTokens()
  }

  /**
   * Create the transaction object
   */
  createSendMessage(
    fromAddress: string,
    toAddress: string,
    amount: string
  ) {
    return this.api.MsgSend(fromAddress, {
      toAddress,
      amounts: [parseCosmosLIKE(amount)],
    }) as CosmosMessage
  }
}
