const en = require("./translations/en")
const zhHantHK = require("./translations/zh-Hant-HK")
const zhHantTW = require("./translations/zh-Hant-TW")

export const LANGUAGES = [
  { key: "en", name: "English", translation: en, canSet: true },
  { key: "zh-Hant-HK", name: "中文(香港)", translation: zhHantHK, canSet: true },
  { key: "zh-Hant-TW", name: "中文(台灣)", translation: zhHantTW, canSet: true },
  { key: "zh-Hans-CN", name: "中文(中国)", translation: zhHantHK, canSet: false },
]
