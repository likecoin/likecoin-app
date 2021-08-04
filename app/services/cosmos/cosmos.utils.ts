/* eslint-disable @typescript-eslint/camelcase */
import BigNumber from "bignumber.js"
import { Coin } from "@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin";
import {
  CosmosCoinResult,
  CosmosDelegation,
  CosmosRedelegation,
  CosmosUnbondingDelegation,
  CosmosUnbondingDelegationEntry,
  CosmosValidator,
  CosmosValidatorReward,
} from "./cosmos.types"
import { DelegationDelegatorReward } from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/distribution";
import {
  Commission,
  CommissionRates,
  Delegation,
  DelegationResponse,
  Description,
  Redelegation,
  UnbondingDelegation,
  UnbondingDelegationEntry,
  Validator
} from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking";

/**
 * Parse the given amount of given denom in number to Cosmos coin format
 *
 * @param value The amount of given denom
 */
export function parseCosmosCoin(value: number | string, denom: string) {
  return {
    denom,
    amount: `${value}`,
  }
}

/**
 * Convert the given amount of given denom
 *
 * @param coin The amount of given denom
 */
export function extractCoinFromCosmosCoinList(coins: CosmosCoinResult[], denom: string) {
  if (!coins || !coins.length) return "0"
  const [coin] = coins.filter(coin => coin.denom === denom)
  return coin.amount
}

/**
 * Calculate the total balance of unbonding delegation
 * from CosmosUnbondingDelegationEntry[]
 *
 * @param entries The unbonding delegation entries
 * @return The total balance of unbonding delegation
 */
export function calculateUnbondingDelegationBalanceFromResultEntries(entries: CosmosUnbondingDelegationEntry[]) {
  return entries.reduce(
    (total, { balance }) => new BigNumber(balance).plus(total),
    new BigNumber(0)
  )
}

/**
 * Valdiate the Cosmos account address
 *
 * @param address The Cosmos account address
 * @return Validity of the address
 */
export function validateAccountAddress(address: string) {
  return /^cosmos1[ac-hj-np-z02-9]{38}$/.test(address)
}

export function convertDelegationDelegatorReward
  (reward: DelegationDelegatorReward): CosmosValidatorReward {
  const { validatorAddress, reward: rewardInput } = reward
  const coins = rewardInput.map(coin => coin as CosmosCoinResult)
  return { validator_address: validatorAddress, reward: coins }
}

function convertDescription
  (description: Description = {} as Description) {
  const {
    moniker = '',
    identity = '',
    website = '',
    details = ''
  } = description;
  return { moniker, identity, website, details }
}

function convertCommissionRates
  (commissionRates: CommissionRates = {} as CommissionRates) {
  const { rate = '', maxRate = '', maxChangeRate = '' } = commissionRates
  return {
    rate,
    max_rate: maxRate,
    max_change_rate: maxChangeRate,
  }
}

function convertCommission
  (commission: Commission = {} as Commission) {
  const {
    commissionRates = {} as CommissionRates,
    updateTime = ''
  } = commission
  return {
    commission_rates: convertCommissionRates(commissionRates),
    update_time: updateTime.toString(),
  }
}

export function convertValidator
  (validator: Validator = {} as Validator): CosmosValidator {
  const {
    operatorAddress = '',
    consensusPubkey = '',
    jailed = false,
    status = 0,
    tokens = '',
    delegatorShares = '',
    description = {} as Description,
    unbondingHeight = '',
    unbondingTime = '',
    commission = {} as Commission,
    minSelfDelegation = '',
  } = validator;

  return {
    operator_address: operatorAddress,
    consensus_pubkey: consensusPubkey.toString(),
    jailed,
    status,
    tokens,
    delegator_shares: delegatorShares,
    description: convertDescription(description),
    unbonding_height: unbondingHeight.toString(),
    unbonding_time: unbondingTime.toString(),
    commission: convertCommission(commission),
    min_self_delegation: minSelfDelegation,
  };
}

export function convertDelegationResponse
  (res: DelegationResponse = {} as DelegationResponse): CosmosDelegation {
  const { delegation = {} as Delegation, balance = {} as Coin } = res
  const { delegatorAddress = '', validatorAddress = '', shares = '' } = delegation
  const { amount = '' } = balance
  return {
    delegator_address: delegatorAddress,
    validator_address: validatorAddress,
    shares: shares,
    balance: amount,
  }
}

export function convertRedelegation
  (redelegation: Redelegation = {} as Redelegation): CosmosRedelegation {
  const {
    delegatorAddress = '',
    validatorSrcAddress = '',
    validatorDstAddress = '',
  } = redelegation
  return {
    delegator_address: delegatorAddress,
    validator_src_address: validatorSrcAddress,
    validator_dst_address: validatorDstAddress,
  }
}

function convertUnbondingDelegationEntry
  (entry: UnbondingDelegationEntry = {} as UnbondingDelegationEntry):
  CosmosUnbondingDelegationEntry {
  const {
    creationHeight = 0,
    completionTime = '',
    initialBalance = '',
    balance = '',
  } = entry
  return {
    creation_height: creationHeight.toString(),
    completion_time: completionTime.toString(),
    initial_balance: initialBalance,
    balance,
  }
}

export function convertUnbondingDelegation
  (delegation: UnbondingDelegation = {} as UnbondingDelegation):
  CosmosUnbondingDelegation {
  const { delegatorAddress = '', validatorAddress = '', entries = [] } = delegation
  return {
    delegator_address: delegatorAddress,
    validator_address: validatorAddress,
    entries: entries.map(e => convertUnbondingDelegationEntry(e)),
  }
}