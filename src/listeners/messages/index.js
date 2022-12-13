const { hiCallback } = require("./sample-message");

const noBotMessages = async ({ message, next }) => {
  console.log("message");
  console.log(message);
  if (
    (message.bot_id === undefined || message.text.startsWith("<!channel>")) &&
    message.previous_message?.bot_id === undefined
  ) {
    await next();
  }
};

module.exports.register = (app) => {
  app.message(noBotMessages, hiCallback);
};
