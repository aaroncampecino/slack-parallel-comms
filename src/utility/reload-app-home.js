const {
  homeView,
  notAllowed,
  notifyWorkspace,
} = require("../user-interface/app-home");

import { logger } from "../logger";
import { User } from "../database/model/User";
import { UserMap } from "../database/model/UserMap";

module.exports = async (client, context, slackUserID, isNotify = false) => {
  try {
    const teamId = context.teamId;
    const adminWorkspace = await User.findById(teamId);
    if (!adminWorkspace.isAdmin) {
      await client.views.publish({
        user_id: slackUserID,
        view: notAllowed(),
        token: adminWorkspace.bot.token,
      });
      return;
    }

    const workspaces = await User.find({ isAdmin: false });

    if (isNotify) {
      await client.views.publish({
        user_id: slackUserID,
        view: notifyWorkspace(workspaces),
        token: adminWorkspace.bot.token,
      });
      return;
    }

    const userMap = await UserMap.find();

    await client.views.publish({
      user_id: slackUserID,
      view: homeView(workspaces, userMap),
      token: adminWorkspace.bot.token,
    });
  } catch (error) {
    logger.error(`${error}`);
  }
};
