/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */


module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    /* ... other resolver config options ... */
    extraNodeModules: {
      '@react-native-community/cli': 'C:\Users\MEER\AppData\Roaming\npm\node_modules\@react-native-community\cli',
    },
  },
};
