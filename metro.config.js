/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  resolver: {
    extraNodeModules: {
        stream: require.resolve('readable-stream'),
        crypto: require.resolve('react-native-crypto'),
        // "node-fetch": require.resolve('isomorphic-fetch')
    },
    sourceExts: ['jsx', 'js', 'ts', 'tsx']
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
