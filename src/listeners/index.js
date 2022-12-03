const eventsListener = require("./events");
const messageListener = require("./messages");
const actionsListener = require("./actions");
const viewsListener = require("./views");

module.exports.registerListeners = (app) => {
  eventsListener.register(app);
  messageListener.register(app);
  actionsListener.register(app);
  viewsListener.register(app);
};
