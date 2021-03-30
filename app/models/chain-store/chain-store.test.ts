import { ChainStoreModel, ChainStore } from "./chain-store"

test("can be created", () => {
  const instance: ChainStore = ChainStoreModel.create({
    id: "likecoin-chain",
    denom: "Like",
    fractionDenom: "like",
    fractionDigits: 10,
  })

  expect(instance).toBeTruthy()
})
