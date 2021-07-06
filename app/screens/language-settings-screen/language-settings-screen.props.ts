import { NavigationStackScreenProps } from "react-navigation-stack"

import { LanguageSettingsStore } from "../../models/language-settings-store"

export interface LanguageSettingsScreenProps extends NavigationStackScreenProps<{}> {
  languageSettingsStore: LanguageSettingsStore
}
