const { App, LogLevel } = require("@slack/bolt");
import "dotenv/config";
import { getInstallationStore } from "./installationStore";
import { registerListeners } from "./listeners";
import { logger } from "./logger";
const db = require("./database/db");
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

// const receiver = new SocketModeReceiver({
//   appToken: process.env.SLACK_APP_TOKEN,
//   // customRoutes: authRoutes,
//   installerOptions: {
//     port: process.env.PORT,
//   },
// });

// const app = new App({
//   receiver: receiver,
//   token: process.env.SLACK_BOT_TOKEN,
//   logLevel: logLevel,
// });

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
  installationStore: getInstallationStore(),
});

registerListeners(app);

// app.client.files.upload({
//   token: 123,
// });

// app.client.chat.postMessage({
//   attachments: {},
// })
(async () => {
  // Start the app
  await app.start(process.env.PORT);
  logger.info(`⚡️ Bolt apps is running on port ${process.env.PORT}!`);
  db.connect();
})();
