import { ContentBookmarksStoreModel, ContentBookmarksStore } from "./content-bookmarks-store"

test("can be created", () => {
  const instance: ContentBookmarksStore = ContentBookmarksStoreModel.create({})

  expect(instance).toBeTruthy()
})