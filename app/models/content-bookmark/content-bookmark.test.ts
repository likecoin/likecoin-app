import { ContentBookmarkModel, ContentBookmark } from "./content-bookmark"

test("can be created", () => {
  const instance: ContentBookmark = ContentBookmarkModel.create({
    url: "example.com",
    timestamp: 0,
  })

  expect(instance).toBeTruthy()
})
