import BigNumber from "bignumber.js"
import {
  CosmosCoinResult,
  CosmosUnbondingDelegationEntry,
} from "./cosmos.types"

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
