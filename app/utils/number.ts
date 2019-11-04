import BigNumber from 'bignumber.js'

export function parseNumber(value: string | number) {
  const parsed = Number.parseInt(`${value}`, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function sum(value1: string | number, value2: string | number) {
  return parseNumber(value1) + parseNumber(value2)
}

export function formatNumber(value: string, decimalPlaces?: number) {
  return new BigNumber(value).toFormat(decimalPlaces)
}

export function formatLIKE(value: number | string) {
  return `${value} LIKE`
}

export function percent(number: number | string) {
  return new BigNumber(number).toFormat(2).concat("%")
}
