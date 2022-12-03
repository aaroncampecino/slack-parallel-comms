const { homeView } = require("../user-interface/app-home");

import { logger } from "../logger";
import { User } from "../database/model/User";
import { UserMap } from "../database/model/UserMap";

module.exports = async (client, slackUserID) => {
  try {
    const workspaces = await User.find({ isAdmin: false });
    const userMap = await UserMap.find();

    await client.views.publish({
      user_id: slackUserID,
      view: homeView(workspaces, userMap),
    });
  } catch (error) {
    logger.error(`${error}`);
  }
};
