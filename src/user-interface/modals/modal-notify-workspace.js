const { Modal, Blocks, Elements, Option } = require("slack-block-builder");

module.exports = (channels) => {
  return Modal({
    title: "Map User",
    submit: "Notify",
    callbackId: "view-notify-workspace",
  })
    .blocks(
      Blocks.Input({
        label: "Channel",
        blockId: "channelName",
      })
        // .optional(true)
        .element(
          Elements.StaticSelect({
            actionId: "channelName",
            placeholder: "Select a channel",
          }).options(
            channels.map((item) =>
              Option({
                text: `${item}`,
                value: `${item}`,
              })
            )
          )
        ),
      Blocks.Input({
        label: "Message",
        blockId: "messageId",
      }).element(Elements.TextInput({ actionId: "messageId" }).multiline(true))
    )
    .buildToJSON();
};
