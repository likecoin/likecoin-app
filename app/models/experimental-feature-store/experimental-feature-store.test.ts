import { ExperimentalFeatureStoreModel, ExperimentalFeatureStore } from "./experimental-feature-store"

test("can be created", () => {
  const instance: ExperimentalFeatureStore = ExperimentalFeatureStoreModel.create({})

  expect(instance).toBeTruthy()
})