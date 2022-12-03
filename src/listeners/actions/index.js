const { createChannelCallback } = require("./create-channel-action");
const { mapUserCallback } = require("./map-user-action");
const { appHomeUsersCallback } = require("./app-home-users-action");
const { notifyWorkspaceCallback } = require("./notify-workspace-action");
const { notifyCallback } = require("./notify-action");

module.exports.register = (app) => {
  app.action("app-home-create-channel", createChannelCallback);
  app.action("app-home-users", appHomeUsersCallback);
  app.action("app-home-map-user", mapUserCallback);
  app.action("app-home-notify-workspace", notifyWorkspaceCallback);
  app.action("app-home-notify", notifyCallback);
};
