const { Modal, Blocks, Elements, Option } = require("slack-block-builder");

module.exports = (workspaces) => {
  return Modal({
    title: "Create Channel",
    submit: "Create",
    callbackId: "view-create-channel",
  })
    .blocks(
      Blocks.Input({
        label: "Workspaces",
        blockId: "workspace",
      }).element(
        Elements.StaticSelect({
          actionId: "workspace",
          placeholder: "Select a workspace",
        }).options(
          workspaces.map((item) =>
            Option({ text: item.team.name, value: item._id })
          )
        )
      ),
      Blocks.Input({
        label: "Channel name",
        blockId: "channelNameId",
      }).element(Elements.TextInput({ actionId: "channelNameId" }))
    )
    .buildToJSON();
};
