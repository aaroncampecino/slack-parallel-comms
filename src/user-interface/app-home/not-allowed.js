const { HomeTab, Header } = require("slack-block-builder");

module.exports = () => {
  const homeNotAllowed = HomeTab({
    callbackId: "app-home",
    privateMetaData: "not-allowed",
  }).blocks(
    Header({
      text: "You are not allowed to use the app. Please contact Admin.",
    })
  );
  return homeNotAllowed.buildToJSON();
};
