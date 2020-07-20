import {
  SuperLikedContent,
  SuperLikedContentModel,
} from "./super-liked-content"

test("can be created", () => {
  const instance: SuperLikedContent = SuperLikedContentModel.create({
    id: "0",
    timestamp: 0,
  })

  expect(instance).toBeTruthy()
})
