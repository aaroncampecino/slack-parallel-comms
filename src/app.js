const { App, LogLevel } = require("@slack/bolt");
import "dotenv/config";
import { registerListeners } from "./listeners";
import { logger } from "./logger";
const orgAuth = require("./database/auth/store_user_org_install");
const workspaceAuth = require("./database/auth/store_user_workspace_install");
const db = require("./database/db");
const user = require("./database/model/User");
const customRoutes = require("./utility/custom_routes");
const manifest = require("../manifest.json");

let logLevel;
switch (process.env.LOG_LEVEL) {
  case "debug":
    logLevel = LogLevel.DEBUG;
    break;
  case "info":
    logLevel = LogLevel.INFO;
    break;
  case "warn":
    logLevel = LogLevel.WARN;
    break;
  case "error":
    logLevel = LogLevel.ERROR;
    break;
  default:
    logLevel = LogLevel.INFO;
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: process.env.SLACK_SOCKET_MODE === "true",
  scopes: manifest.oauth_config.scopes.bot,
  logLevel: logLevel,
  customRoutes: customRoutes.customRoutes,
});

registerListeners(app);

(async () => {
  // Start the app
  await app.start(process.env.PORT);
  logger.info(`⚡️ Bolt apps is running on port ${process.env.PORT}!`);
  db.connect();
})();
