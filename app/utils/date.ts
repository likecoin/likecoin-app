export const ONE_DAY_IN_MS = 86400000
export const ONE_HOUR_IN_MS = 3600000

export function getTimeZoneOffset() {
  const offset = new Date().getTimezoneOffset() / -60
  return `${offset >= 0 ? "+" : ""}${offset}`
}
