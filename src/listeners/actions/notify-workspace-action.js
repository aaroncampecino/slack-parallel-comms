import { modals } from "../../user-interface";
import { Channel } from "../../database/model/Channel";
import { User } from "../../database/model/User";

const notifyWorkspaceCallback = async ({
  body,
  ack,
  client,
  action,
  context,
}) => {
  await ack();

  const teamId = context.teamId;
  const adminWorkspace = await User.findById(teamId);

  const channels = await Channel.distinct("suppliers.channelName");

  await client.views.open({
    trigger_id: body.trigger_id,
    view: modals.notifyWorkspace(channels),
    token: adminWorkspace.bot.token,
  });
};

module.exports = {
  notifyWorkspaceCallback,
};
