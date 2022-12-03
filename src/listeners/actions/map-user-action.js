import { modals } from "../../user-interface";
import { User } from "../../database/model/User";
import { UserMap } from "../../database/model/UserMap";
import { getNonBotUsers } from "../../utility/slack_api";

const mapUserCallback = async ({ body, ack, client, action, context }) => {
  await ack();
  const adminTeamId = context.teamId;
  const teamId = action.value;

  const adminWorkspace = await User.findById(adminTeamId);
  const supplierWorkspace = await User.findById(teamId);

  const adminToken = adminWorkspace.bot.token;
  const supplierToken = supplierWorkspace.bot.token;

  const adminUsers = await getNonBotUsers(
    client,
    adminWorkspace._id,
    adminToken
  );
  const supplierUsers = await getNonBotUsers(client, teamId, supplierToken);

  const userMap = await UserMap.find({ "suppliers.teamId": teamId });

  await client.views.open({
    trigger_id: body.trigger_id,
    view: modals.modalMapUser(teamId, adminUsers, supplierUsers, userMap[0]),
    token: adminToken,
  });
};

module.exports = {
  mapUserCallback,
};
