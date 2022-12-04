const mongoose = require("mongoose");

const conversationsSchema = mongoose.Schema(
  {
    _id: String,
    admin: {
      client_msg_id: String,
      type: String,
      text: String,
      user: String,
      ts: String,
      team: String,
      thread_ts: String,
      parent_user_id: String,
      channel: String,
      event_ts: String,
      channel_type: String,
      subtype: String,
      files: [{ id: String, permalink_public: String }],
    },
    suppliers: {
      client_msg_id: String,
      type: String,
      text: String,
      user: String,
      ts: String,
      team: String,
      thread_ts: String,
      parent_user_id: String,
      channel: String,
      event_ts: String,
      channel_type: String,
      subtype: String,
      files: [{ id: String, permalink_public: String }],
    },
  },
  { _id: false, typeKey: "$type" }
);

const Conversation = mongoose.model("Conversation", conversationsSchema);

module.exports = {
  Conversation,
};
