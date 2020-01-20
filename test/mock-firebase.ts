jest.mock('@react-native-firebase/analytics', () => {}, { virtual: true })
jest.mock('@react-native-firebase/crashlytics', () => {}, { virtual: true })
jest.mock('@react-native-firebase/app', () => {
  return {
    app: jest.fn(() => ({
      utils: jest.fn(() => ({})),
    })),
  }
}, { virtual: true })
