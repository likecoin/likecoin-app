import BigNumber from "bignumber.js"

export const UNIT_LIKE = "LIKE"

export function compareNumber(value: string | number) {
  const bigNumber = new BigNumber(value)
  if (bigNumber.isNegative()) return -1
  if (bigNumber.isZero()) return 0
  return 1
}

export function parseNumber(value: string | number) {
  const parsed = Number.parseInt(`${value}`, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function sum(value1: string | number, value2: string | number) {
  return parseNumber(value1) + parseNumber(value2)
}

export function formatNumber(value: string | number, decimalPlaces?: number) {
  return new BigNumber(value).toFormat(decimalPlaces)
}

export function formatNumberWithSign(value: string | number, decimalPlaces?: number) {
  let sign = ""
  switch (compareNumber(value)) {
    case 1:
      sign = "+"
      break

    case -1:
      sign = "-"
      break
  }
  return sign.concat(formatNumber(value, decimalPlaces))
}

export function formatLIKE(value: number | string) {
  return `${value} ${UNIT_LIKE}`
}

export function percent(number: number | string) {
  return new BigNumber(number).toFormat(2).concat("%")
}
