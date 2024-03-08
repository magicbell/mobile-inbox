const {getDefaultConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('mjs');
config.resolver.sourceExts.push('cjs');
module.exports = config;
