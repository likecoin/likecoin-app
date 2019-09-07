import { ContentModel, Content } from "./content"

test("can be created", () => {
  const instance: Content = ContentModel.create({
    url: 'https://like.co',
  })

  expect(instance).toBeTruthy()
})