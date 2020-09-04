import { Instance, SnapshotOut, types } from "mobx-state-tree"

import {
  AppLanguageKey,
  LANGUAGES,
  LANGUAGE_KEY_LIST,
  SYSTEM_LANGUAGE,
  setI18nLocale,
} from "../../i18n"
import { logError } from "../../utils/error"

/**
 * Language settings.
 */
export const LanguageSettingsStoreModel = types
  .model("LanguageSettingsStore")
  .props({
    activeLanguageKey: types.optional(types.string, SYSTEM_LANGUAGE),
  })
  .views(self => ({
    get items() {
      return LANGUAGE_KEY_LIST.map(key => ({
        ...LANGUAGES[key],
        key,
        isActive: self.activeLanguageKey === key,
      }))
    },
  }))
  .actions(self => {
    let onChangeCallback: (languageKey?: AppLanguageKey) => void

    return {
      afterCreate() {
        setI18nLocale(self.activeLanguageKey as AppLanguageKey)
      },
      listenChange(callback: (languageKey?: AppLanguageKey) => void) {
        onChangeCallback = callback
      },
      setLanguage(languageKey: AppLanguageKey) {
        self.activeLanguageKey = setI18nLocale(languageKey)
        if (onChangeCallback) {
          try {
            onChangeCallback(languageKey)
          } catch (error) {
            logError(error)
          }
        }
      },
    }
  })

type LanguageSettingsStoreType = Instance<typeof LanguageSettingsStoreModel>
export interface LanguageSettingsStore extends LanguageSettingsStoreType {}
type LanguageSettingsStoreSnapshotType = SnapshotOut<
  typeof LanguageSettingsStoreModel
>
export interface LanguageSettingsStoreSnapshot
  extends LanguageSettingsStoreSnapshotType {}
