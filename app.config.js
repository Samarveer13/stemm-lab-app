const baseConfig = require("./app.json");
const secrets = require("./app.secrets.json");

module.exports = {
  ...baseConfig,
  expo: {
    ...baseConfig.expo,
    android: {
      ...baseConfig.expo.android,
      config: {
        googleMaps: {
          apiKey: secrets.googleMapsApiKey,
        },
      },
    },
  },
};
