import BigNumber from "bignumber.js"

export const DENOM = "nanolike"

/**
 * Convert the given amount of LIKE to nanolike
 * 
 * @param value The amount of LIKE
 */
export function convertLIKEToNanolike(value: number | string) {
  return new BigNumber(value).times(new BigNumber(1000000000)).toFixed()
}

/**
 * Convert the given amount of nanolike to LIKE
 * 
 * @param value The amount of nanolike
 */
export function convertNanolikeToLIKE(value: number | string) {
  return new BigNumber(value).div(new BigNumber(1000000000)).toFixed()
}

/**
 * Parse the given amount of nanolike in number to Cosmos coin format
 * 
 * @param value The amount of nanolike
 */
export function parseCosmosCoin(value: number | string) {
  return {
    denom: DENOM,
    amount: `${value}`,
  }
}

/**
 * Parse the given amount of LIKE to Cosmos coin format
 * 
 * @param value The amount of LIKE
 */
export function parseCosmosLIKE(value: number | string) {
  return parseCosmosCoin(convertLIKEToNanolike(value))
}