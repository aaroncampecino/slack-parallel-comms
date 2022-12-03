const { createChannelCallback } = require("./create-channel-action");
const { mapUserCallback } = require("./map-user-action");

module.exports.register = (app) => {
  app.action("app-home-create-channel", createChannelCallback);
  app.action("app-home-map-user", mapUserCallback);
};
