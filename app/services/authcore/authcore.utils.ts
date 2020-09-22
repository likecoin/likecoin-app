import i18n from "i18n-js"

export function findBestAvailableLanguage(language = i18n.locale) {
  switch (language) {
    case "en":
      return "en"
    default:
      return "zh-hk"
  }
}
