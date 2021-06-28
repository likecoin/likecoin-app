export function parseNumber(value: string | number) {
  const parsed = Number.parseInt(`${value}`, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function sum(value1: string | number, value2: string | number) {
  return parseNumber(value1) + parseNumber(value2)
}

const PERCENT_DIFF_MAX = 999

export function calcPercentDiff(value1: number, value2: number) {
  if (value1 === 0) {
    return -PERCENT_DIFF_MAX
  }
  if (value2 === 0) {
    return PERCENT_DIFF_MAX
  }
  let percentage = (value1 - value2) / value2 * 100
  percentage = Math.max(
    -PERCENT_DIFF_MAX,
    Math.min(PERCENT_DIFF_MAX, Math.round(percentage))
  )
  return percentage
}

export function withAbsPercent(percent: number) {
  const value = Math.abs(percent)
  return `${value === PERCENT_DIFF_MAX ? `100` : value}%`
}

export function formatLikeAmountText(likeAmount: number) {
  if (likeAmount > 0 && likeAmount < 0.0001) return '< 0.0001';
  return likeAmount.toFixed(4);
}
