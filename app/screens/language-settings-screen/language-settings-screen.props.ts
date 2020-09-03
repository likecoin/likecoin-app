import { NavigationScreenProps } from "react-navigation"

import { LanguageSettingsStore } from "../../models/language-settings-store"

export interface LanguageSettingsScreenProps extends NavigationScreenProps<{}> {
  languageSettingsStore: LanguageSettingsStore
}
