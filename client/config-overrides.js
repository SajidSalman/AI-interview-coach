module.exports = function override(config, env) {
  config.devServer = {
    ...config.devServer,
    hot: true,
    allowedHosts: "all", // ✅ Fix for "Invalid options object" error
    client: {
      overlay: false, // Disable error overlay for hot updates
    },
  };
  return config;
};
