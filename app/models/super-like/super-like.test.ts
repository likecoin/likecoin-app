import { SuperLike, SuperLikeModel } from "./super-like"

test("can be created", () => {
  const instance: SuperLike = SuperLikeModel.create({
    id: "0",
    timestamp: 0,
  })

  expect(instance).toBeTruthy()
})
