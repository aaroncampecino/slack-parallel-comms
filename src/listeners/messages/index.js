const { hiCallback } = require("./sample-message");

const noBotMessages = async ({ message, next }) => {
  if (message.bot_id === undefined) {
    await next();
  }
};

module.exports.register = (app) => {
  app.message(noBotMessages, hiCallback);
};
