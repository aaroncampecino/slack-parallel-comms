import { modals } from "../../user-interface";
import { User } from "../../database/model/User";

const createChannelCallback = async ({ body, ack, client, context }) => {
  const teamId = context.teamId;
  await ack();
  // await new Promise((r) => setTimeout(r, 3000));
  const workspaces = await User.find({ isAdmin: false });
  const adminWorkspace = await User.findById(teamId);

  if (workspaces === null) {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: modals.modalInfo(
        "SDJ Services",
        "temp_callback",
        "No workspace found.",
        ":information_source:"
      ),
    });
    return;
  }

  await client.views.open({
    trigger_id: body.trigger_id,
    view: modals.modalCreateChannel(workspaces),
    token: adminWorkspace.bot.token,
  });
};

module.exports = {
  createChannelCallback,
};
