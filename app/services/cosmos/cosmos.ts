import Cosmos from "@lunie/cosmos-api"

import {
  CosmosAccountResult,
  CosmosValidator,
  CosmosMessage,
  CosmosDelegation,
} from "./cosmos.types"
import { DENOM, parseCosmosLIKE, convertLIKEToNanolike } from "./cosmos.utils"

/**
 * Cosmos API helper for LikeCoin
 */
export class CosmosAPI {
  /**
   * The Cosmos API client
   */
  api: Cosmos

  setup(restURL: string, chainId: string) {
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
   * Get all delegations from a delegator
   *
   * @param delegatorAddress The delegator address
   */
  async getDelegations(delegatorAddress: string) {
    return this.api.get.delegations(delegatorAddress) as CosmosDelegation[]
  }

  /**
   * Query the annual provisioned tokens
   */
  async queryAnnualProvision() {
    return this.api.get.annualProvisionedTokens()
  }

  /**
   * Create the send message object
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

  /**
   * Create the delegate message object
   */
  createDelegateMessage(
    fromAddress: string,
    validatorAddress: string,
    amount: string
  ) {
    return this.api.MsgDelegate(fromAddress, {
      validatorAddress,
      amount: convertLIKEToNanolike(amount),
      denom: DENOM,
    }) as CosmosMessage
  }

  /**
   * Create the undelegate message object
   */
  createUnbondingDelegateMessage(
    fromAddress: string,
    validatorAddress: string,
    amount: string
  ) {
    return this.api.MsgUndelegate(fromAddress, {
      validatorAddress,
      amount: convertLIKEToNanolike(amount),
      denom: DENOM,
    }) as CosmosMessage
  }
}
