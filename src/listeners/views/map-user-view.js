import { User } from "../../database/model/User";
import { UserMap } from "../../database/model/UserMap";
import { getUserInfo } from "../../utility/slack_api";
import { reloadAppHome } from "../../utility";
const mapUserCallback = async ({ ack, view, body, client, context }) => {
  await ack();

  const providedValues = view.state.values;

  const teamId = context.teamId;
  const adminUser = await User.findById(teamId);

  const supplierId = view.private_metadata;
  const supplierUser = await User.findById(supplierId);

  const adminuserId =
    providedValues.adminuserId.adminuserId.selected_option.value;
  const adminmapUserId =
    providedValues.adminmapUserId.adminmapUserId.selected_option.value;
  const supplieruserId =
    providedValues.supplieruserId.supplieruserId.selected_option.value;
  const suppliermapUserId =
    providedValues.suppliermapUserId.suppliermapUserId.selected_option.value;

  console.log("adminuserId " + adminuserId);
  console.log("adminmapUserId " + adminmapUserId);
  console.log("supplieruserId " + supplieruserId);
  console.log("suppliermapUserId " + suppliermapUserId);

  const adminusername = await getUserInfo(
    client,
    adminuserId,
    adminUser.bot.token
  );
  const adminmapUsername = await getUserInfo(
    client,
    adminmapUserId,
    supplierUser.bot.token
  );
  const supplierusername = await getUserInfo(
    client,
    supplieruserId,
    supplierUser.bot.token
  );
  const suppliermapUsername = await getUserInfo(
    client,
    suppliermapUserId,
    adminUser.bot.token
  );

  await UserMap.updateOne(
    {},
    {
      admin: {
        teamId: teamId,
        userId: adminuserId, //this is the userId in admin workspace
        userName: adminusername.user.real_name,
        mapUserId: adminmapUserId, //this is the userId in supplier workspace
        mapUserName: adminmapUsername.user.real_name,
      },
      suppliers: {
        teamId: supplierId,
        userId: supplieruserId, //this is the userId in supplier workspace
        userName: supplierusername.user.real_name,
        mapUserId: suppliermapUserId, //this is the userId in admin workspace
        mapUserName: suppliermapUsername.user.real_name,
      },
    },
    { upsert: true }
  );

  reloadAppHome(client, context, body.user.id);
};

module.exports = { mapUserCallback };
