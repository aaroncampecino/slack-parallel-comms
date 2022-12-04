const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    _id: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    team: { id: String, name: String },
    enterprise: { id: String, name: String },
    user: {
      token: String,
      scopes: [String],
      id: String,
      refreshToken: String,
      expiresAt: Number,
    },
    tokenType: String,
    isEnterpriseInstall: Boolean,
    appId: String,
    authVersion: String,
    bot: {
      scopes: [String],
      token: String,
      userId: String,
      id: String,
      refreshToken: String,
      expiresAt: Number,
    },
    incomingWebhook: {
      url: String,
      channel: String,
      channelId: String,
      configurationUrl: String,
    },
  },
  { _id: false }
);

const User = mongoose.model("User", usersSchema);

const findUser = async (id) => {
  try {
    const user = await User.findById(id);
    if (user !== undefined) {
      return user;
    }
  } catch (error) {
    console.error(error);
  }
  return false;
};

const deleteUser = async (id) => {
  try {
    await User.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error(error);
  }
  return false;
};

module.exports = {
  findUser,
  deleteUser,
  User,
};
