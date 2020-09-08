import * as RNLocalize from "react-native-localize"
import i18n from "i18n-js"

import { AppLanguageKey, LANGUAGES, translationGetters } from "./languages"

i18n.fallbacks = true
i18n.missingTranslationPrefix = "Missing Translation: "
i18n.missingBehaviour = "guess"

export function setI18nLocale(key: AppLanguageKey) {
  const language = LANGUAGES[key]
  if (language) {
    i18n.translations = {
      [key]: translationGetters[language.translationKey || key](),
    }
    i18n.locale = key
  }
  return i18n.locale as AppLanguageKey
}

const fallback = { languageTag: "en", isRTL: false }
const { languageTag } =
  RNLocalize.findBestAvailableLanguage(Object.keys(LANGUAGES)) || fallback
export const SYSTEM_LANGUAGE = languageTag as AppLanguageKey
setI18nLocale(SYSTEM_LANGUAGE)
