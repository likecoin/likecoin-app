jest.mock("@react-native-cookies/cookies", () => ({
  CookieManager: jest.fn(),
}));