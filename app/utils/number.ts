/**
 * Convert nanolike to LIKE
 * 
 * @param value The amount in nanolike
 */
export function nanolikeToLIKE(amount: string) {
  return (Number.parseFloat(amount) / 1e9).toLocaleString()
}
