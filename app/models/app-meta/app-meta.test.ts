import { AppMetaModel, AppMeta } from "./app-meta"

test("can be created", () => {
  const instance: AppMeta = AppMetaModel.create({
    isNew: false,
  })

  expect(instance).toBeTruthy()
})
