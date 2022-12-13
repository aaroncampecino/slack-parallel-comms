const { Modal, Blocks, Elements, Option } = require("slack-block-builder");

module.exports = (workspaces) => {
  return Modal({
    title: "Create Channel",
    submit: "Create",
    callbackId: "view-create-channel",
  })
    .blocks(
      Blocks.Input({
        label: "Channel name",
        blockId: "channelNameId",
      }).element(Elements.TextInput({ actionId: "channelNameId" }))
    )
    .buildToJSON();
};
