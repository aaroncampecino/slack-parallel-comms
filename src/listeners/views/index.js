const { createChannelCallback } = require("./create-channel-view");

module.exports.register = (app) => {
  app.view("view-create-channel", createChannelCallback);
};
