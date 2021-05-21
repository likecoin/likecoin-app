export function getPriceEmoji(price = 0) {
  if (price >= 100) return "🍾";
  if (price >= 50) return "🥩";
  if (price >= 10) return "🍰";
  if (price > 0) return "☕️";
  return "";
}
