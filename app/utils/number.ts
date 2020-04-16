export function parseNumber(value: string | number) {
  const parsed = Number.parseInt(`${value}`, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function sum(value1: string | number, value2: string | number) {
  return parseNumber(value1) + parseNumber(value2)
}

export function calcPercentDiff(value1: number, value2: number) {
  if (value2 === 0) {
    return 999
  }
  let percentage = (value1 - value2) / value2 * 100
  percentage = Math.max(-999, Math.min(999, Math.round(percentage)))
  return percentage
}
