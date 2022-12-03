const { Modal, Blocks, Elements, Option } = require("slack-block-builder");
const { logger } = require("../../logger");

module.exports = (id, summary, description, status, statusId, transitions) => {
  let statId = "";
  transitions.map((item) => {
    if (item.name === status) {
      statId = item.id;
    }
  });

  return Modal({
    title: "Edit issue",
    submit: "Update",
    callbackId: "view-edit-issue",
    privateMetaData: `${id}`,
  })
    .blocks(
      Blocks.Input({ label: "Summary", blockId: "summary" }).element(
        Elements.TextInput({ actionId: "summary" }).initialValue(summary)
      ),
      Blocks.Input({ label: "Description", blockId: "description" }).element(
        Elements.TextInput({ actionId: "description" })
          .multiline(true)
          .initialValue(description)
      ),
      Blocks.Input({ label: "Status", blockId: "status" }).element(
        Elements.StaticSelect({
          actionId: "status",
          placeholder: "Select status",
        })
          .options(
            transitions.map((item) =>
              Option({ text: `${item.name}`, value: `${item.id}` })
            )
          )
          .initialOption(Option({ text: `${status}`, value: `${statId}` }))
      )
    )
    .buildToJSON();
};
