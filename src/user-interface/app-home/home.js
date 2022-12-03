const {
  HomeTab,
  Header,
  Divider,
  Section,
  Actions,
  Elements,
  Button,
  Blocks,
} = require("slack-block-builder");
const { logger } = require("../../logger");

module.exports = (workspaces, userMap) => {
  const homeTab = HomeTab({
    callbackId: "app-home",
    privateMetaData: "sdj-services",
  }).blocks(
    Actions({ blockId: "app-home-channel" }).elements(
      Button({ text: "Users" })
        .value("app-home-users")
        .actionId("app-home-users")
        .primary(true),
      Button({ text: "Create Channel" })
        .value("app-home-create-channel")
        .actionId("app-home-create-channel"),
      Button({ text: "Notify Workspace" })
        .value("app-home-notify-workspace")
        .actionId("app-home-notify-workspace")
    )
  );

  if (workspaces.length === 0) {
    homeTab.blocks(
      Header({
        text: "No workspace available.",
      })
    );
    return homeTab.buildToJSON();
  }

  const allWorkspaces = [];

  workspaces.map((element) => {
    let actions = Actions({ blockId: `actionId${element._id}` }).elements(
      Button({
        text: "Map User",
        actionId: "app-home-map-user",
        value: `${element._id}`,
      })
    );

    const mapIndex = userMap.findIndex((user, index) => {
      if (user.suppliers.teamId == element._id) return true;
    });

    const map = userMap.splice(mapIndex, 1)[0];
    let adminUserName = map?.admin?.userName;
    if (adminUserName === undefined) adminUserName = "None";
    let adminMapUsername = map?.admin?.mapUserName;
    if (adminMapUsername === undefined) adminMapUsername = "None";

    let supplierUserName = map?.suppliers?.mapUserName;
    if (supplierUserName === undefined) supplierUserName = "None";
    let supplierMapUsername = map?.suppliers?.userName;
    if (supplierMapUsername === undefined) supplierMapUsername = "None";

    allWorkspaces.push(
      Divider(),
      Section({
        text: `*Workspace name:* ${element.team.name}\n*Admin user*\nAdmin name: ${adminUserName}\tSupplier name: ${adminMapUsername}\n*Suplier user*\nAdmin name: ${supplierUserName}\tSupplier name: ${supplierMapUsername}`,
      }),
      actions
    );
  });

  homeTab.blocks(
    Section({ text: `Workspaces`, blockId: "sectionId" }),
    allWorkspaces
  );

  return homeTab.buildToJSON();
};
