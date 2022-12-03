const mongoose = require("mongoose");

const UsermapSchema = mongoose.Schema({
  admin: {
    teamId: String,
    userId: String, //this is the userId in admin workspace
    userName: String,
    mapUserId: String, //this is the userId in supplier workspace
    mapUserName: String,
  },
  suppliers: {
    teamId: String,
    userId: String, //this is the userId in supplier workspace
    userName: String,
    mapUserId: String, //this is the userId in admin workspace
    mapUserName: String,
  },
});

const UserMap = mongoose.model("UserMap", UsermapSchema);

module.exports = {
  UserMap,
};
