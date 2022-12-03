import { modals } from "../../user-interface";
import { User } from "../../database/model/User";
import { Channel } from "../../database/model/Channel";

const notifyCallback = async ({ body, ack, client, action, context }) => {
  await ack();
  const teamId = action.value;
  const adminTeamId = context.teamId;

  const adminWorkspace = await User.findById(adminTeamId);

  const adminToken = adminWorkspace.bot.token;

  const suppliersChannel = await Channel.find({ "suppliers.teamId": teamId });

  await client.views.open({
    trigger_id: body.trigger_id,
    view: modals.notifyWorkspace(teamId, suppliersChannel),
    token: adminToken,
  });
};

module.exports = {
  notifyCallback,
};
