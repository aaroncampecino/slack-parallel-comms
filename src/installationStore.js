const orgAuth = require("./database/auth/store_user_org_install");
const workspaceAuth = require("./database/auth/store_user_workspace_install");
const user = require("./database/model/User");

export const getInstallationStore = () => {
  return {
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
        if (data === null) return data;
        return data._doc;
      }
      if (installQuery.teamId !== undefined) {
        const data = await user.findUser(installQuery.teamId);
        if (data === null) return data;
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
  };
};
