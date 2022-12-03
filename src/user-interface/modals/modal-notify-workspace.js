const { Modal, Blocks, Elements, Option } = require("slack-block-builder");

module.exports = (supplierId, channels) => {
  return Modal({
    title: "Map User",
    submit: "Notify",
    callbackId: "view-notify-workspace",
    privateMetaData: `${supplierId}`,
  })
    .blocks(
      Blocks.Input({
        label: "Channel",
        blockId: "channelId",
      }).element(
        Elements.StaticSelect({
          actionId: "channelId",
          placeholder: "Select channel",
        }).options(
          channels.map((item) =>
            Option({
              text: `${item.suppliers.channelName}`,
              value: `${item.suppliers.channelId}`,
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
