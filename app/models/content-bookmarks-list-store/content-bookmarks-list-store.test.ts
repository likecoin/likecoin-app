import { ContentBookmarksListStoreModel, ContentBookmarksListStore } from "./content-bookmarks-list-store"

test("can be created", () => {
  const instance: ContentBookmarksListStore = ContentBookmarksListStoreModel.create({})

  expect(instance).toBeTruthy()
})