import {
  LanguageSettingsStoreModel,
  LanguageSettingsStore,
} from "./language-settings-store"

test("can be created", () => {
  const instance: LanguageSettingsStore = LanguageSettingsStoreModel.create({})

  expect(instance).toBeTruthy()
})
