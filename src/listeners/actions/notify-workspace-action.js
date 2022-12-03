import { reloadAppHome } from "../../utility";

const notifyWorkspaceCallback = async ({
  body,
  ack,
  client,
  action,
  context,
}) => {
  await ack();
  reloadAppHome(client, context, body.user.id, true);
};

module.exports = {
  notifyWorkspaceCallback,
};
