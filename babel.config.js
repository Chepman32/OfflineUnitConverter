module.exports = function (api) {
  api && api.cache && api.cache(true);
  const plugins = [];
  try {
    require.resolve('react-native-reanimated/plugin');
    plugins.push('react-native-reanimated/plugin'); // must be last
  } catch {
    // Plugin not installed yet; skip to keep dev/tests working pre-install
  }
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  };
};
