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

module.exports = (workspaces) => {
  const homeTab = HomeTab({
    callbackId: "app-home",
    privateMetaData: "sdj-services",
  }).blocks(
    Actions({ blockId: "app-home-channel" }).elements(
      Button({ text: "Users" })
        .value("app-home-users")
        .actionId("app-home-users"),
      Button({ text: "Create Channel" })
        .value("app-home-create-channel")
        .actionId("app-home-create-channel"),
      Button({ text: "Notify Workspace" })
        .value("app-home-notify-workspace")
        .actionId("app-home-notify-workspace")
        .primary(true)
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
    allWorkspaces.push(
      Divider(),
      Section({
        text: `*Workspace name:* ${element.team.name}`,
      }).accessory(
        Button({
          text: "Notify",
          actionId: "app-home-notify",
          value: `${element._id}`,
        })
      )
    );
  });

  homeTab.blocks(
    Section({ text: `Workspaces`, blockId: "sectionId" }),
    allWorkspaces
  );

  return homeTab.buildToJSON();
};
