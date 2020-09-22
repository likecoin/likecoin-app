export const translationGetters = {
  en: () => require("./translations/en"),
  "zh-Hans-CN": () => require("./translations/zh-Hans-CN"),
  "zh-Hant-HK": () => require("./translations/zh-Hant-HK"),
  "zh-Hant-TW": () => require("./translations/zh-Hant-TW"),
}

export type AppTranslationKey = keyof typeof translationGetters

export interface AppLanguage {
  name: string
  translationKey?: AppTranslationKey
}

export const LANGUAGES = {
  en: { name: "English" } as AppLanguage,
  "zh-Hans-CN": { name: "中文(中国)" } as AppLanguage,
  "zh-Hant-HK": { name: "中文(香港)" } as AppLanguage,
  "zh-Hant-TW": { name: "中文(台灣)" } as AppLanguage,
}

export type AppLanguageKey = keyof typeof LANGUAGES

export const LANGUAGE_KEY_LIST: AppLanguageKey[] = [
  "en",
  "zh-Hans-CN",
  "zh-Hant-HK",
  "zh-Hant-TW",
]
