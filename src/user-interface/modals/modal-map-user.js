const { Modal, Blocks, Elements, Option } = require("slack-block-builder");

module.exports = (supplierId, adminUsers, supplierUsers, data) => {
  let adminuserIdOption;
  let adminmapUserIdOption;
  let supplieruserIdOption;
  let suppliermapUserIdOption;

  if (data !== undefined) {
    adminuserIdOption = Option({
      text: `${data?.admin.userName}`,
      value: `${data?.admin.userId}`,
    });

    adminmapUserIdOption = Option({
      text: `${data?.admin.mapUserName}`,
      value: `${data?.admin.mapUserId}`,
    });

    supplieruserIdOption = Option({
      text: `${data?.suppliers.userName}`,
      value: `${data?.suppliers.userId}`,
    });

    suppliermapUserIdOption = Option({
      text: `${data?.suppliers.mapUserName}`,
      value: `${data?.suppliers.mapUserId}`,
    });
  }

  return Modal({
    title: "Map User",
    submit: "Update",
    callbackId: "view-map-user",
    privateMetaData: `${supplierId}`,
  })
    .blocks(
      Blocks.Input({
        label: "Admin User on Admin Workspace",
        blockId: "adminuserId",
      }).element(
        Elements.StaticSelect({
          actionId: "adminuserId",
          placeholder: "Select user",
        })
          .options(
            adminUsers.map((item) =>
              Option({ text: `${item.real_name}`, value: `${item.id}` })
            )
          )
          .initialOption(adminuserIdOption)
      ),
      Blocks.Input({
        label: "Admin User on Supplier Workspace",
        blockId: "adminmapUserId",
      }).element(
        Elements.StaticSelect({
          actionId: "adminmapUserId",
          placeholder: "Select user",
        })
          .options(
            supplierUsers.map((item) =>
              Option({ text: `${item.real_name}`, value: `${item.id}` })
            )
          )
          .initialOption(adminmapUserIdOption)
      ),
      Blocks.Input({
        label: "Supplier User on Supplier Workspace",
        blockId: "supplieruserId",
      }).element(
        Elements.StaticSelect({
          actionId: "supplieruserId",
          placeholder: "Select user",
        })
          .options(
            supplierUsers.map((item) =>
              Option({ text: `${item.real_name}`, value: `${item.id}` })
            )
          )
          .initialOption(supplieruserIdOption)
      ),
      Blocks.Input({
        label: "Supplier User on Admin Workspace",
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
      )
    )
    .buildToJSON();
};
