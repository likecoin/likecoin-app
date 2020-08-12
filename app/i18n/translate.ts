import i18n from "i18n-js"

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(key: string, options?: object) {
  return key ? i18n.t(key, options) : null
}

/**
 * Check translation exists.
 *
 * @param key The i18n key.
 * @return Return `true` if the i18n key has translation
 */
export function isTranslatable(key: string): boolean {
  return (i18n.t(key) || "").indexOf(i18n.missingTranslationPrefix) === -1
}

/**
 * Translates text with fallback text.
 *
 * @param key The i18n key.
 * @param fallbackText The fallback text.
 */
export function translateWithFallbackText(key: string, fallbackText: string = key, options?: object) {
  return isTranslatable(key) ? translate(key, options) : fallbackText
}
