import * as RNLocalize from "react-native-localize"
import i18n from "i18n-js"

import { LANGUAGES } from "./languages"

i18n.fallbacks = true
i18n.missingTranslationPrefix = "Missing Translation: "
i18n.missingBehaviour = "guess"

i18n.translations = LANGUAGES.reduce(
  (translations, language) => ({
    ...translations,
    [language.key]: language.translation,
  }),
  {},
)

const fallback = { languageTag: "en", isRTL: false }
export const { languageTag: SYSTEM_LANGUAGE } =
  RNLocalize.findBestAvailableLanguage(
    LANGUAGES.map(language => language.key),
  ) || fallback
i18n.locale = SYSTEM_LANGUAGE
