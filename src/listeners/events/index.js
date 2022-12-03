const { appHomeOpenedCallback } = require("./app_home_opened");
const { channelCreatedCallback } = require("./channel_created");

module.exports.register = (app) => {
  app.event("app_home_opened", appHomeOpenedCallback);
  // app.event("channel_created", channelCreatedCallback);
};
