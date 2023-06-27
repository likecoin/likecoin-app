/* eslint-disable @typescript-eslint/camelcase */
import {
  DistributionExtension,
  QueryClient,
  setupDistributionExtension,
  setupStakingExtension,
  StargateClient,
  StakingExtension,
  SigningStargateClient,
  DeliverTxResponse,
  MsgSendEncodeObject,
  MsgDelegateEncodeObject,
  MsgUndelegateEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from "@cosmjs/stargate";
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { TextDecoder } from 'text-decoding';
import BigNumber from "bignumber.js";
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { BondStatusString } from "@cosmjs/stargate/build/modules/staking/queries";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";

import {
  CosmosCoinResult,
  CosmosDelegation,
  CosmosMessage,
  CosmosMessageToSign,
  CosmosRedelegation,
  CosmosRewardsResult,
  CosmosSigningClient,
  CosmosUnbondingDelegation,
  CosmosValidator,
} from "./cosmos.types"
import {
  convertValidator,
  convertDelegationDelegatorReward,
  convertDelegationResponse,
  convertUnbondingDelegation,
  convertRedelegation,
  convertDecCoin,
} from "./cosmos.utils"
import { MintExtension, setupMintExtension } from "./mint-query-extension"


// Mitigate https://github.com/cosmos/cosmos-sdk/issues/11407
const INITIAL_PAGINATION_KEY = new Uint8Array([0x00])

/**
 * Cosmos API helper for LikeCoin
 */
export class CosmosAPI {
  gasLimits: any

  restURL: string

  stargateClient: StargateClient

  queryClient: QueryClient & DistributionExtension & StakingExtension & MintExtension

  async setup(restURL: string, gasLimits: any) {
    this.restURL = restURL
    this.gasLimits = gasLimits
    this.stargateClient = await StargateClient.connect(restURL);

    const tendermint34Client = await Tendermint34Client.connect(restURL);
    this.queryClient = QueryClient.withExtensions(
      tendermint34Client,
      setupDistributionExtension,
      setupStakingExtension,
      setupMintExtension,
    )
  }

  /**
   * Get bonded token of the staking pool
   */
  async getStakingPoolBondedToken() {
    const { pool: { bondedTokens } } = await this.queryClient.staking.pool()
    return bondedTokens
  }

  /**
   * Get the list of validators
   */
  async getValidators({ paginationKey = INITIAL_PAGINATION_KEY } = {}): Promise<CosmosValidator[]> {
    const bondStatus = '' as BondStatusString
    const { validators, pagination } = await this.queryClient.staking.validators(bondStatus, paginationKey)
    const parsedValidators = validators.map(v => convertValidator(v))
    if (pagination?.nextKey?.length) {
      parsedValidators.push(...await this.getValidators({ paginationKey: pagination?.nextKey }))
    }
    return parsedValidators
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
    return amount || '0'
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
    const { validators } = await this.queryClient.staking.delegatorValidators(delegatorAddress);
    if (!validators.length) return [];
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
    try {
      const { delegationResponse } =
        await this.queryClient.staking.delegation(delegatorAddress, validatorAddress)
      return convertDelegationResponse(delegationResponse)
    } catch (error) {
      if (error.message.includes('code = NotFound')) {
        return convertDelegationResponse({})
      }
      throw error;
    }
  }

  /**
   * Get all redelegations
   *
   * @param delegatorAddress The delegator address
   */
  async getRedelegations(delegatorAddress: string):
    Promise<CosmosRedelegation[]> {
    const { redelegationResponses } =
      await this.queryClient.staking.redelegations(delegatorAddress, '', '')
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
    const { annualProvisions } = await this.queryClient.mint.annualProvisions()
    const provision = new TextDecoder().decode(annualProvisions);
    return new BigNumber(provision).shiftedBy(-18).toFixed();
  }

  /**
   * Create a signing client implements the CosmosSigner interface
   */
  async createSigningClient(signer: OfflineDirectSigner): Promise<CosmosSigningClient> {
    const signingStargateClient = await SigningStargateClient.connectWithSigner(this.restURL, signer)
    return {
      async signAndBroadcast(message: CosmosMessageToSign): Promise<DeliverTxResponse> {
        const { signerAddress, msgs, fee, memo } = message
        const result = await signingStargateClient.signAndBroadcast(signerAddress, msgs, fee, memo)
        return result
      }
    }
  }

  /**
   * Create the send message object
   */
  createSendMessage(
    fromAddress: string,
    toAddress: string,
    amount: string,
    denom: string
  ): CosmosMessage {
    const msg: MsgSendEncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: MsgSend.fromPartial({
        fromAddress,
        toAddress,
        amount: [{ amount, denom }],
      })
    }
    return { signerAddress: fromAddress, msgs: [msg] }
  }

  /**
   * Create the delegate message object
   */
  createDelegateMessage(
    fromAddress: string,
    validatorAddress: string,
    amount: string,
    denom: string,
  ): CosmosMessage {
    const msg: MsgDelegateEncodeObject = {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: MsgDelegate.fromPartial({
        delegatorAddress: fromAddress,
        validatorAddress: validatorAddress,
        amount: { amount, denom },
      })
    }
    return { signerAddress: fromAddress, msgs: [msg] }
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
  ): CosmosMessage {
    const msg = {
      typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      value: MsgBeginRedelegate.fromPartial({
        delegatorAddress: senderAddress,
        validatorSrcAddress: validatorSourceAddress,
        validatorDstAddress: validatorDestinationAddress,
        amount: { amount, denom },
      })
    }
    return { signerAddress: senderAddress, msgs: [msg] }
  }

  /**
   * Create the undelegate message object
   */
  createUnbondingDelegateMessage(
    fromAddress: string,
    validatorAddress: string,
    amount: string,
    denom: string
  ): CosmosMessage {
    const msg: MsgUndelegateEncodeObject = {
      typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
      value: MsgUndelegate.fromPartial({
        delegatorAddress: fromAddress,
        validatorAddress,
        amount: { amount, denom },
      })
    }
    return { signerAddress: fromAddress, msgs: [msg] }
  }

  /**
   * Create the rewards withdraw message object
   */
  createRewardsWithdrawMessage(
    fromAddress: string,
    validatorAddresses: string[],
  ): CosmosMessage {
    const msgs = validatorAddresses.map(validatorAddress => {
      const withdrawMsg: MsgWithdrawDelegatorRewardEncodeObject = {
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: MsgWithdrawDelegatorReward.fromPartial({
          delegatorAddress: fromAddress,
          validatorAddress,
        })
      }
      return withdrawMsg
    })
    return { signerAddress: fromAddress, msgs }
  }

  /**
   * Estimate gas according to message's typeUrl
   */
  estimateGasByMessageType(typeUrl: string): number {
    switch (typeUrl) {
      case '/cosmos.bank.v1beta1.MsgSend':
        return this.gasLimits.send
      case '/cosmos.staking.v1beta1.MsgDelegate':
        return this.gasLimits.delegate
      case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
        return this.gasLimits.redelegate
      case '/cosmos.staking.v1beta1.MsgUndelegate':
        return this.gasLimits.undelegate
      case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
        return this.gasLimits.withdraw
      default:
        return this.gasLimits.send * 2
    }
  }

  /**
   * Simulate gas in a CosmosMessage
   */
  simulateGas(message: CosmosMessage): number {
    let gas = 0
    message.msgs.forEach(msg => {
      gas += this.estimateGasByMessageType(msg.typeUrl)
    })
    return gas
  }
}
