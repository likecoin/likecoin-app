/* eslint-disable @typescript-eslint/camelcase */
import Cosmos from "@lunie/cosmos-api"
import {
  StargateClient,
  QueryClient,
  DistributionExtension,
  StakingExtension,
  setupDistributionExtension,
  setupStakingExtension,
} from "@cosmjs/stargate";
import { BondStatusString } from "@cosmjs/stargate/build/queries/staking";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

import {
  CosmosAccountResult,
  CosmosCoinResult,
  CosmosDelegation,
  CosmosMessage,
  CosmosRedelegation,
  CosmosRewardsResult,
  CosmosUnbondingDelegation,
  CosmosValidator,
} from "./cosmos.types"
import {
  extractCoinFromCosmosCoinList,
  parseCosmosCoin,
  convertValidator,
  convertDecCoin,
  convertDelegationDelegatorReward,
  convertDelegationResponse,
  convertUnbondingDelegation,
  convertRedelegation,
} from "./cosmos.utils"

/**
 * Cosmos API helper for LikeCoin
 */
export class CosmosAPI {
  /**
   * The Cosmos API client
   */
  api: Cosmos

  stargateClient: StargateClient

  tendermint34Client: Tendermint34Client

  queryClient: QueryClient & DistributionExtension & StakingExtension

  async setup(restURL: string, chainId: string) {
    this.api = new Cosmos(restURL, chainId)
    this.stargateClient = await StargateClient.connect(restURL);
    this.tendermint34Client = await Tendermint34Client.connect(restURL);
    this.queryClient = QueryClient.withExtensions(
      this.tendermint34Client,
      setupDistributionExtension,
      setupStakingExtension,
    )
  }

  /**
   * Get the list of validators
   */
  async getValidators(): Promise<CosmosValidator[]> {
    const bondStatus: BondStatusString = 'BOND_STATUS_BONDED'
    const { validators } = await this.queryClient.staking.validators(bondStatus)
    return validators.map(v => convertValidator(v))
  }

  /**
   * Get a validator by address
   */
  async queryValidator(address: string): Promise<CosmosValidator> {
    const { validator } = await this.queryClient.staking.validator(address);
    return convertValidator(validator)
  }

  /**
   * Get the account balance for LikeCoin
   *
   * @param address The account address
   */
  async queryBalance(address: string, denom: string): Promise<string> {
    const { amount } = await this.stargateClient.getBalance(address, denom)
    return amount
  }

  /**
   * Get the total rewards balance from all delegations
   *
   * @param address The address of the delegator
   */
  async queryRewards(address: string): Promise<CosmosRewardsResult> {
    const { rewards: rewardsInput, total: totalInput } =
      await this.queryClient.distribution.delegationTotalRewards(address)
    return {
      rewards: rewardsInput.map(r => convertDelegationDelegatorReward(r)),
      total: totalInput.map(coin => convertDecCoin(coin))
    }
  }

  /**
   * Query a single delegation reward by a delegator
   *
   * @param delegatorAddress The delegator address
   * @param validatorAddress The validator address
   */
  async queryRewardsFromValidator(delegatorAddress: string, validatorAddress: string):
    Promise<CosmosCoinResult[]> {
    const { rewards } = await
      this.queryClient.distribution.delegationRewards(delegatorAddress, validatorAddress);
    return rewards.map(coin => convertDecCoin(coin))
  }

  /**
   * Get all delegations from a delegator
   *
   * @param delegatorAddress The delegator address
   */
  async getDelegations(delegatorAddress: string): Promise<CosmosDelegation[]> {
    const { delegationResponses } =
      await this.queryClient.staking.delegatorDelegations(delegatorAddress)
    return delegationResponses.map(d => convertDelegationResponse(d))
  }

  /**
   *  Query a delegation between a delegator and a validator
   *
   * @param delegatorAddress The delegator address
   * @param validatorAddress The validator address
   */
  async getDelegation(delegatorAddress: string, validatorAddress: string):
    Promise<CosmosDelegation> {
    const { delegationResponse } =
      await this.queryClient.staking.delegation(delegatorAddress, validatorAddress);
    return convertDelegationResponse(delegationResponse)
  }

  /**
   * Get all redelegations
   *
   * @param delegatorAddress The delegator address
   */
  async getRedelegations(delegatorAddress: string):
    Promise<CosmosRedelegation[]> {
    const { redelegationResponses } =
      await this.queryClient.staking.redelegations(delegatorAddress, 'sourceValidatorAddress', 'destinationValidatorAddress');
    return redelegationResponses.map(res => convertRedelegation(res.redelegation))
  }

  /**
   * Get all unbonding delegations from a delegator
   *
   * @param delegatorAddress The delegator address
   */
  async getUnbondingDelegations(delegatorAddress: string):
    Promise<CosmosUnbondingDelegation[]> {
    const { unbondingResponses: unbondingDelegation } =
      await this.queryClient.staking.delegatorUnbondingDelegations(delegatorAddress)
    return unbondingDelegation.map(d => convertUnbondingDelegation(d))
  }

  /**
   * Query all unbonding delegations between a delegator and a validator
   *
   * @param delegatorAddress The delegator address
   * @param validatorAddress The validator address
   */
  async getUnbondingDelegation(delegatorAddress: string, validatorAddress: string):
    Promise<CosmosUnbondingDelegation> {
    const { unbond } =
      await this.queryClient.staking.unbondingDelegation(delegatorAddress, validatorAddress)
    return convertUnbondingDelegation(unbond)
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
   * Create the redelegate message object
   */
  createRedelegateMessage(
    senderAddress: string,
    validatorSourceAddress: string,
    validatorDestinationAddress: string,
    amount: string,
    denom: string,
  ) {
    return this.api.MsgRedelegate(senderAddress, {
      validatorSourceAddress,
      validatorDestinationAddress,
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
