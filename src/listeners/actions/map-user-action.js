import { modals } from "../../user-interface";
import { User } from "../../database/model/User";
import { getNonBotUsers } from "../../utility/slack_api";

const mapUserCallback = async ({ body, ack, client, action }) => {
  await ack();

  const teamId = action.value;

  const adminWorkspace = await User.find({ isAdmin: true });
  const supplierWorkspace = await User.findById(teamId);

  const adminToken = adminWorkspace[0].bot.token;
  const supplierToken = supplierWorkspace.bot.token;

  const adminUsers = await getNonBotUsers(
    client,
    adminWorkspace._id,
    adminToken
  );
  const supplierUsers = await getNonBotUsers(client, teamId, supplierToken);

  console.log("adminWorkspace");
  console.log(adminWorkspace);

  console.log("supplierWorkspace");
  console.log(supplierWorkspace);
};

module.exports = {
  mapUserCallback,
};
