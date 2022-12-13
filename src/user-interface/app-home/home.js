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
      Button({ text: ":file_folder: Workspaces" })
        .value("app-home-users")
        .actionId("app-home-users")
        .primary(true),
      Button({ text: ":hash: Create Channel" })
        .value("app-home-create-channel")
        .actionId("app-home-create-channel"),
      Button({ text: ":mailbox_with_mail: Notify Workspace" })
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
    const mapIndex = userMap.findIndex((user, index) => {
      if (user.suppliers.teamId == element._id) return true;
    });

    const map = userMap.splice(mapIndex, 1)[0];
    let adminMapUsername = map?.admin?.mapDisplayName;
    if (adminMapUsername === undefined) adminMapUsername = "None";

    let supplierMapUsername = map?.suppliers?.mapDisplayName;
    if (supplierMapUsername === undefined) supplierMapUsername = "None";

    allWorkspaces.push(
      Section({
        // text: `*Workspace name:* ${element.team.name}\n*Admin name*: ${supplierMapUsername}\t*Supplier name*: ${adminMapUsername}`,
        text: `*Workspace name:* ${element.team.name}`,
      }),
      // .accessory(
      //   Button({
      //     text: ":world_map: Map User",
      //     actionId: "app-home-map-user",
      //     value: `${element._id}`,
      //   }).primary(true)
      // )
      Divider()
    );
  });

  homeTab.blocks(
    // Section({ text: `Workspaces`, blockId: "sectionId" }),
    allWorkspaces
  );

  return homeTab.buildToJSON();
};
