import { getInstallationStore } from "./installationStore";

const { InstallProvider } = require("@slack/oauth");

const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "aaron-the-great",
  installationStore: getInstallationStore(),
});

export const rotateTokenBeforeUsing = async (query) => {
  return await installer.authorize({
    teamId: query.team.id,
    isEnterpriseInstall: query.isEnterpriseInstall,
    userId: query.user.id,
  });
};
