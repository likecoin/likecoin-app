import Cosmos from "@lunie/cosmos-api"

import { CosmosAccountResult, CosmosValidator } from "./cosmos.types"

const DENOM = "nanolike";

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
    const [coin] = account.coins.filter((coin => coin.denom === DENOM))
    return coin.amount
  }
}
