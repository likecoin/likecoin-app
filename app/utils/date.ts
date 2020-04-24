export function getTimeZoneOffset() {
  const offset = new Date().getTimezoneOffset() / -60
  return `${offset >= 0 ? "+" : ""}${offset}`
}
