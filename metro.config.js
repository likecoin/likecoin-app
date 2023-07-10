/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require("metro-config")

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig()
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
      babelTransformerPath: require.resolve("react-native-svg-transformer")
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg", "js", "jsx"],
      extraNodeModules: {
        buffer: require.resolve('buffer'),
        crypto: require.resolve('react-native-crypto'),
        process: require.resolve('process/browser'),
        stream: require.resolve('readable-stream'),
        util: require.resolve('util/util'),
        vm: require.resolve('vm-browserify')
      },
    },
  }
})()
