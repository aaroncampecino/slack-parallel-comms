const mongoose = require("mongoose");

const UsermapSchema = mongoose.Schema(
  {
    _id: String,
    admin: {
      teamId: String,
      userId: String, //this is the userId in admin workspace
      userName: String,
      userImageOriginal: String,
      mapUserId: String, //this is the userId in supplier workspace
      mapUserName: String,
      mapUserImageOriginal: String,
      mapDisplayName: String,
    },
    suppliers: {
      teamId: String,
      userId: String, //this is the userId in supplier workspace
      userName: String,
      userImageOriginal: String,
      mapUserId: String, //this is the userId in admin workspace
      mapUserName: String,
      mapUserImageOriginal: String,
      mapDisplayName: String,
    },
  },
  { _id: false }
);

const UserMap = mongoose.model("UserMap", UsermapSchema);

module.exports = {
  UserMap,
};
