import Cosmos from "@lunie/cosmos-api"

import {
  CosmosAccountResult,
  CosmosCoinResult,
  CosmosDelegation,
  CosmosMessage,
  CosmosRewardsResult,
  CosmosUnbondingDelegation,
  CosmosValidator,
} from "./cosmos.types"
import {
  extractCoinFromCosmosCoinList,
  parseCosmosCoin,
} from "./cosmos.utils"

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
   * Get a validator by address
   */
  async queryValidator(address: string) {
    return this.api.get.validator(address) as CosmosValidator
  }

  /**
   * Get the account balance for LikeCoin
   *
   * @param address The account address
   */
  async queryBalance(address: string, denom: string) {
    const account = await this.api.get.account(address) as CosmosAccountResult
    return extractCoinFromCosmosCoinList(account.coins, denom)
  }

  /**
   * Get the total rewards balance from all delegations
   *
   * @param address The address of the delegator
   */
  async queryRewards(address: string) {
    return this.api.get.delegatorRewards(address) as CosmosRewardsResult
  }

  /**
   * Query a single delegation reward by a delegator
   *
   * @param delegatorAddress The delegator address
   * @param validatorAddress The validator address
   */
  async queryRewardsFromValidator(delegatorAddress: string, validatorAddress: string) {
    return this.api.get.delegatorRewardsFromValidator(delegatorAddress, validatorAddress) as CosmosCoinResult[]
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
   *  Query a delegation between a delegator and a validator
   *
   * @param delegatorAddress The delegator address
   * @param validatorAddress The validator address
   */
  async getDelegation(delegatorAddress: string, validatorAddress: string) {
    return this.api.get.delegation(delegatorAddress, validatorAddress) as CosmosDelegation
  }

  /**
   * Get all unbonding delegations from a delegator
   *
   * @param delegatorAddress The delegator address
   */
  async getUnbondingDelegations(delegatorAddress: string) {
    return this.api.get.undelegations(delegatorAddress) as CosmosUnbondingDelegation[]
  }

  /**
   * Query all unbonding delegations between a delegator and a validator
   *
   * @param delegatorAddress The delegator address
   * @param validatorAddress The validator address
   */
  async getUnbondingDelegation(delegatorAddress: string, validatorAddress: string) {
    return this.api.get.unbondingDelegation(delegatorAddress, validatorAddress) as CosmosUnbondingDelegation
  }

  /**
   * Query the annual provisioned tokens
   */
  async queryAnnualProvision(): Promise<string> {
    return this.api.get.annualProvisionedTokens()
  }

  /**
   * Create the send message object
   */
  createSendMessage(
    fromAddress: string,
    toAddress: string,
    amount: string,
    denom: string
  ) {
    return this.api.MsgSend(fromAddress, {
      toAddress,
      amounts: [parseCosmosCoin(amount, denom)],
    }) as CosmosMessage
  }

  /**
   * Create the delegate message object
   */
  createDelegateMessage(
    fromAddress: string,
    validatorAddress: string,
    amount: string,
    denom: string,
  ) {
    return this.api.MsgDelegate(fromAddress, {
      validatorAddress,
      amount,
      denom,
    }) as CosmosMessage
  }

  /**
   * Create the undelegate message object
   */
  createUnbondingDelegateMessage(
    fromAddress: string,
    validatorAddress: string,
    amount: string,
    denom: string
  ) {
    return this.api.MsgUndelegate(fromAddress, {
      validatorAddress,
      amount,
      denom,
    }) as CosmosMessage
  }

  /**
   * Create the rewards withdraw message object
   */
  createRewardsWithdrawMessage(
    fromAddress: string,
    validatorAddresses: string[],
  ) {
    return this.api.MultiMessage(
      fromAddress,
      validatorAddresses.map(validatorAddress =>
        this.api.MsgWithdrawDelegationReward(fromAddress, {
          validatorAddress,
        }),
      ),
    ) as CosmosMessage
  }
}
