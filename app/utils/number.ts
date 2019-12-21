export function parseNumber(value: string | number) {
  const parsed = Number.parseInt(`${value}`, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function sum(value1: string | number, value2: string | number) {
  return parseNumber(value1) + parseNumber(value2)
}
