const en = require("./en")
const zhHantHK = require("./zh-Hant-HK")

export const LANGUAGES = [
  { key: "en", name: "English", translation: en, canSet: true },
  { key: "zh-Hant-HK", name: "中文(香港)", translation: zhHantHK, canSet: true },
  { key: "zh-Hant-TW", name: "中文(台灣)", translation: zhHantHK, canSet: false },
  { key: "zh-Hans-CN", name: "中文(中国)", translation: zhHantHK, canSet: false },
]
