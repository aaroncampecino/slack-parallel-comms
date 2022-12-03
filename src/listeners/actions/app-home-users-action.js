import { reloadAppHome } from "../../utility";

const appHomeUsersCallback = async ({ body, ack, client, action, context }) => {
  await ack();
  reloadAppHome(client, context, body.user.id);
};

module.exports = {
  appHomeUsersCallback,
};
