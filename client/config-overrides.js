module.exports = function override(config, env) {
  config.devServer = {
    ...config.devServer,
    hot: true,
    client: {
      overlay: false, // Disable error overlay for hot updates
    },
  };
  return config;
};
