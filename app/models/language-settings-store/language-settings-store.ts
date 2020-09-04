import { Instance, SnapshotOut, types } from "mobx-state-tree"
import i18n from "i18n-js"

import { LANGUAGES, SYSTEM_LANGUAGE } from "../../i18n"
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
      return LANGUAGES.filter(language => language.canSet).map(language => ({
        ...language,
        isActive: self.activeLanguageKey === language.key,
      }))
    },
  }))
  .actions(self => {
    let onChangeCallback: (languageKey?: string) => void

    return {
      afterCreate() {
        i18n.locale = self.activeLanguageKey
      },
      listenChange(callback: (languageKey?: string) => void) {
        onChangeCallback = callback
      },
      setLanguage(languageKey: string) {
        self.activeLanguageKey = languageKey
        i18n.locale = languageKey
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
