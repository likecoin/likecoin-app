const en = require("./en")
const zhHantHK = require("./zh-Hant-HK")

export const LANGUAGES = [
  { key: "en", translation: en },
  { key: "zh-Hant-HK", translation: zhHantHK },
  { key: "zh-Hant-TW", translation: zhHantHK, isHidden: true },
  { key: "zh-Hans-CN", translation: zhHantHK, isHidden: true },
]
