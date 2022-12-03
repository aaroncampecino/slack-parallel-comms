import { logger } from "../../logger";
import { User } from "../../database/model/User";
import { Channel } from "../../database/model/Channel";
import { createChannel } from "../../utility/slack_api";

const channelCreatedCallback = async ({ client, event }) => {
  try {
    const channelName = event.channel.name;
    const channelId = event.channel.id;
    const teamId = event.channel.context_team_id;

    console.log("Creating channel " + channelName);

    //check if teamId isAdmin in User table
    const user = await User.findById(teamId);
    const isAdmin = user.isAdmin;
    if (!isAdmin) return;

    await User.find({ isAdmin: false }).then(async (users) => {
      await createChannel(client, channelName, users).then((channels) => {
        //record to Channel table
        Channel.create({
          admin: { teamId: teamId, channelId: channelId, userId: "" },
          suppliers: channels,
        });
      });
    });
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { channelCreatedCallback };
