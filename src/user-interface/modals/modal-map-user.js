const { Modal, Blocks, Elements, Option } = require("slack-block-builder");

module.exports = (supplierId, adminUsers, data) => {
  let adminmapUserIdOption;
  let suppliermapUserIdOption;
  let adminDisplayname;
  let supplierDisplayname;

  if (data !== undefined) {
    adminmapUserIdOption = Option({
      text: `${data?.admin.mapUserName}`,
      value: `${data?.admin.mapUserId}`,
    });

    adminDisplayname = data?.admin.mapDisplayName;

    suppliermapUserIdOption = Option({
      text: `${data?.suppliers.mapUserName}`,
      value: `${data?.suppliers.mapUserId}`,
    });

    supplierDisplayname = data?.suppliers.mapDisplayName;
  }

  return Modal({
    title: "Map User",
    submit: "Update",
    callbackId: "view-map-user",
    privateMetaData: `${supplierId}`,
  })
    .blocks(
      Blocks.Input({
        label: "User to display on Supplier Workspace",
        blockId: "adminmapUserId",
      }).element(
        Elements.StaticSelect({
          actionId: "adminmapUserId",
          placeholder: "Select user",
        })
          .options(
            adminUsers.map((item) =>
              Option({ text: `${item.real_name}`, value: `${item.id}` })
            )
          )
          .initialOption(adminmapUserIdOption)
      ),

      Blocks.Input({
        label: "Display name",
        blockId: "admindisplayNameId",
      }).element(
        Elements.TextInput({
          actionId: "admindisplayNameId",
          placeholder: "",
          initialValue: adminDisplayname,
        })
      ),

      Blocks.Input({
        label: "User to display on Admin Workspace",
        blockId: "suppliermapUserId",
      }).element(
        Elements.StaticSelect({
          actionId: "suppliermapUserId",
          placeholder: "Select user",
        })
          .options(
            adminUsers.map((item) =>
              Option({ text: `${item.real_name}`, value: `${item.id}` })
            )
          )
          .initialOption(suppliermapUserIdOption)
      ),
      Blocks.Input({
        label: "Display name",
        blockId: "supplierdisplayNameId",
      }).element(
        Elements.TextInput({
          actionId: "supplierdisplayNameId",
          placeholder: "",
          initialValue: supplierDisplayname,
        })
      )
    )
    .buildToJSON();
};
