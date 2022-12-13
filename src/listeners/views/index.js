const { createChannelCallback } = require("./create-channel-view");
const { mapUserCallback } = require("./map-user-view");
const { notifyWorkspaceCallback } = require("./notify-workspace-view");

module.exports.register = (app) => {
  app.view("view-create-channel", createChannelCallback);
  app.view("view-map-user", mapUserCallback);
  app.view("view-notify-workspace", notifyWorkspaceCallback);
};
