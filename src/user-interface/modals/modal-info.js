const { Modal, Blocks } = require("slack-block-builder");

module.exports = (title, callback, text, icon) =>
  Modal({ title: `${title}`, callbackId: `${callback}` })
    .blocks(
      Blocks.Section({
        text: `${icon} ${text}`,
      })
    )
    .buildToJSON();
