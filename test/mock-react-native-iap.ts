jest.mock("react-native-iap", () => {
  const useIAP = (): Record<string, unknown> => ({
    connected: true,
    getProducts: jest.fn(),
    getSubscriptions: jest.fn(),
    products: [],
    subscriptions: [],
  })
  
  const withIAPContext = jest.fn()

  return {
    useIAP,
    withIAPContext,
  }
})
