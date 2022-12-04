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
  signingSecret: process.env.SLACK_BOT_SIGNING_SECRET,
  // token: process.env.SLACK_BOT_TOKEN,
  clientId: process.env.SLACK_CLIENT_ID,
  // appToken: process.env.SLACK_APP_TOKEN,
  // socketMode: process.env.SLACK_SOCKET_MODE === "true",
  scopes: manifest.oauth_config.scopes.bot,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  logLevel: logLevel,
  customRoutes: customRoutes.customRoutes,
  stateSecret: "aaron-the-great",
  installerOptions: {
    stateVerification: false,
    // directInstall: true,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      console.log("installation " + JSON.stringify(installation));
      if (
        installation.isEnterpriseInstall &&
        installation.enterprise !== undefined
      ) {
        return await orgAuth.saveUserOrgInstall(installation);
      }
      if (installation.team !== undefined) {
        return await workspaceAuth.saveUserWorkspaceInstall(installation);
      }
      throw new Error("Failed saving installation data to installationStore");
    },
    fetchInstallation: async (installQuery) => {
      // console.log("installQuery " + installQuery);
      // console.log(installQuery);
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        const data = await user.findUser(installQuery.enterpriseId);
        return data._doc;
      }
      if (installQuery.teamId !== undefined) {
        const data = await user.findUser(installQuery.teamId);
        return data._doc;
      }
      throw new Error("Failed fetching installation");
    },
    deleteInstallation: async (installQuery) => {
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        return await user.deleteUser(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        return await user.deleteUser(installQuery.teamId);
      }
      throw new Error("Failed to delete installation");
    },
  },
});

registerListeners(app);

// app.client.chat.postMessage({});
(async () => {
  // Start the app
  await app.start(process.env.PORT);
  logger.info(`⚡️ Bolt apps is running on port ${process.env.PORT}!`);
  db.connect();
})();
