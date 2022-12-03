const { reloadAppHome } = require("../../utility");
import { logger } from "../../logger";

const appHomeOpenedCallback = async ({ client, event }) => {
  if (event.tab !== "home") {
    // Ignore the `app_home_opened` event for everything
    // except home as we don't support a conversational UI
    return;
  }
  try {
    if (event.view) {
      await reloadAppHome(client, event.user);
      return;
    }

    // For new users where we've never set the App Home,
    // the App Home event won't send a `view` property
    await reloadAppHome(client, event.user);
  } catch (error) {
    // eslint-disable-next-line no-console
    logger.error(error);
  }
};

module.exports = { appHomeOpenedCallback };
