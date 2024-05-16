const {getDefaultConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('mjs');
config.resolver.sourceExts.push('cjs');
module.exports = config;
