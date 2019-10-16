import BigNumber from 'bignumber.js'

/**
 * Convert nanolike to LIKE
 *
 * @param value The amount in nanolike
 */
export function nanolikeToLIKE(amount: string) {
  return (Number.parseFloat(amount) / 1e9).toLocaleString()
}

export function formatNumber(value: string) {
  return new BigNumber(value).toFormat()
}

export function percent(number: number | string) {
  return new BigNumber(number).toFormat(2).concat("%")
}
