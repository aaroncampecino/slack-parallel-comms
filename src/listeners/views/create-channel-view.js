import { User } from "../../database/model/User";
import { Channel } from "../../database/model/Channel";
import { createChannel } from "../../utility/slack_api";

const createChannelCallback = async ({ ack, view, body, client }) => {
  await ack();

  const providedValues = view.state.values;

  const workspace = providedValues.workspace.workspace.selected_option.value;
  const channelName = providedValues.channelNameId.channelNameId.value;

  console.log("workspace " + workspace);
  console.log("channelName " + channelName);

  const user = await User.findById(workspace);
  const adminUser = await User.find({ isAdmin: true });
  const users = [];
  users.push(user);
  users.push(adminUser[0]);

  const adminTeamId = adminUser[0]._id;

  await createChannel(client, channelName, users).then((channels) => {
    //get the admin channel and remove from channels array
    const adminIndex = channels.findIndex((post, index) => {
      if (post.teamId == adminTeamId) return true;
    });

    const adminChannel = channels.splice(adminIndex, 1)[0];

    Channel.create({
      admin: {
        teamId: adminChannel.teamId,
        channelId: adminChannel.channelId,
        channelName: adminChannel.channelName,
      },
      suppliers: channels[0],
    });
  });
};

module.exports = { createChannelCallback };
