const model = require("../model/User");

const saveUserWorkspaceInstall = async (installation) => {
  try {
    const responseGetCount = await model.User.count();
    let isAdmin = false;

    if (responseGetCount === 0) {
      isAdmin = true;
    } else {
      const user = await model.User.findById(installation.team.id);
      if (user !== undefined && user !== null) isAdmin = user.isAdmin;
      else isAdmin = false;
    }

    const resp = await model.User.updateOne(
      { _id: installation.team.id },
      {
        isAdmin: isAdmin,
        team: { id: installation.team.id, name: installation.team.name },
        enterprise: { id: "null", name: "null" },
        user: {
          token: installation.user.token,
          scopes: installation.user.scopes,
          id: installation.user.id,
          refreshToken: installation.user.refreshToken,
          expiresAt: installation.user.expiresAt,
        },
        tokenType: installation.tokenType,
        isEnterpriseInstall: installation.isEnterpriseInstall,
        appId: installation.appId,
        authVersion: installation.authVersion,
        bot: {
          scopes: installation.bot.scopes,
          token: installation.bot.token,
          userId: installation.bot.userId,
          id: installation.bot.id,
          refreshToken: installation.bot.refreshToken,
          expiresAt: installation.bot.expiresAt,
        },
        incomingWebhook: {
          url: installation.incomingWebhook.url,
          channel: installation.incomingWebhook.channel,
          channelId: installation.incomingWebhook.channelId,
          configurationUrl: installation.incomingWebhook.configurationUrl,
        },
      },
      { upsert: true }
    );
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};
module.exports = { saveUserWorkspaceInstall };
