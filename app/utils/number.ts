import BigNumber from 'bignumber.js'

export function formatNumber(value: string, decimalPlaces?: number) {
  return new BigNumber(value).toFormat(decimalPlaces)
}

export function formatLIKE(value: number | string) {
  return `${value} LIKE`
}

export function percent(number: number | string) {
  return new BigNumber(number).toFormat(2).concat("%")
}
