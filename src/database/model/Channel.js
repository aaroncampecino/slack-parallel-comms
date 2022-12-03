const mongoose = require("mongoose");

const channelsSchema = mongoose.Schema({
  admin: {
    teamId: String,
    channelId: String,
    channelName: String,
  },
  suppliers: {
    teamId: String,
    channelId: String,
    channelName: String,
  },
});

const Channel = mongoose.model("Channel", channelsSchema);

module.exports = {
  Channel,
};
