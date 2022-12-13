import { logger } from "../../logger";
import { User } from "../../database/model/User";
import { Channel } from "../../database/model/Channel";
import { createChannel } from "../../utility/slack_api";

const channelCreatedCallback = async ({ client, event }) => {
  try {
    const channelName = event.channel.name;
    // const channelId = event.channel.id;
    const teamId = event.channel.context_team_id;

    //only listen to admin teamId
    const adminUser = await User.findById(teamId);
    if (!adminUser.isAdmin) return;

    const users = await User.find({ isAdmin: false });
    // const adminUser = await User.find({ isAdmin: true });

    await createChannel(client, channelName, users, adminUser).then(
      (channels) => {
        for (const channel of channels) {
          Channel.create(channel);
        }
      }
    );
  } catch (error) {
    logger.error(`${error}`);
  }
};

module.exports = { channelCreatedCallback };
