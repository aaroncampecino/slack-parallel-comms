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

  const adminmapUserId =
    providedValues.adminmapUserId.adminmapUserId.selected_option.value;
  const adminDisplayName =
    providedValues.admindisplayNameId.admindisplayNameId.value;

  const suppliermapUserId =
    providedValues.suppliermapUserId.suppliermapUserId.selected_option.value;
  const supplierDisplayName =
    providedValues.supplierdisplayNameId.supplierdisplayNameId.value;

  const adminmapUsername = await getUserInfo(
    client,
    adminmapUserId,
    adminUser.bot.token
  );
  const suppliermapUsername = await getUserInfo(
    client,
    suppliermapUserId,
    adminUser.bot.token
  );

  await UserMap.updateOne(
    { _id: supplierId },
    {
      admin: {
        teamId: teamId,
        // userId: adminuserId, //this is the userId in admin workspace
        // userName: adminusername.user.real_name,
        // userImageOriginal: adminusername.user.profile.image_original
        //   ? adminusername.user.profile.image_original
        //   : adminusername.user.profile.image_72,
        mapUserId: adminmapUserId, //this is the userId in supplier workspace
        mapUserName: adminmapUsername.user.real_name,
        mapUserImageOriginal: adminmapUsername.user.profile.image_original
          ? adminmapUsername.user.profile.image_original
          : adminmapUsername.user.profile.image_72,
        mapDisplayName: adminDisplayName,
      },
      suppliers: {
        teamId: supplierId,
        // userId: supplieruserId, //this is the userId in supplier workspace
        // userName: supplierusername.user.real_name,
        // userImageOriginal: supplierusername.user.profile.image_original
        //   ? supplierusername.user.profile.image_original
        //   : supplierusername.user.profile.image_72,
        mapUserId: suppliermapUserId, //this is the userId in admin workspace
        mapUserName: suppliermapUsername.user.real_name,
        mapUserImageOriginal: suppliermapUsername.user.profile.image_original
          ? suppliermapUsername.user.profile.image_original
          : suppliermapUsername.user.profile.image_72,
        mapDisplayName: supplierDisplayName,
      },
    },
    { upsert: true }
  );

  reloadAppHome(client, context, body.user.id);
};

module.exports = { mapUserCallback };
