import { User } from "../database/model/User";
import { UserMap } from "../database/model/UserMap";
import { Conversation } from "../database/model/Conversation";

export const getUserInfo = async (client, userId, token) => {
  return await client.users.info({
    user: userId,
    token: token,
  });
};
export const getNonBotUsers = async (client, teamId, token) => {
  const wsUsersTemp = await client.users.list({
    team_id: teamId,
    token: token,
  });
  const wsUsers = wsUsersTemp.members.filter(
    (member) => member.is_bot === false && member.id !== "USLACKBOT"
  );
  return wsUsers;
};

export const postMessage = async (
  client,
  channels,
  messageText,
  teamId,
  message
) => {
  for (const item of channels) {
    const user = await User.findById(item.teamId);
    const isAdmin = user.isAdmin;

    let filterTeamId = item.teamId;
    if (isAdmin) filterTeamId = teamId;

    const userMap = await UserMap.findById(filterTeamId);
    let username;
    let iconUrl;

    if (isAdmin) {
      username = userMap.suppliers.mapDisplayName;
      iconUrl = userMap.suppliers.mapUserImageOriginal;
    } else {
      username = userMap.admin.mapDisplayName;
      iconUrl = userMap.admin.mapUserImageOriginal;
    }

    const thread_ts = await getThreadTs(message, isAdmin, user);

    console.log("thread_ts " + thread_ts);
    const postedMessage = await client.chat.postMessage({
      channel: item.channelId,
      token: user.bot.token,
      text: messageText,
      username: username,
      icon_url: iconUrl,
      thread_ts: thread_ts,
    });

    console.log("postedMessage " + postedMessage);
    console.log(postedMessage);

    await recordConversation(message, postedMessage, isAdmin);
  }
};

const getThreadTs = async (message, isAdmin) => {
  const thread_ts = message.thread_ts;
  console.log("getThreadTs " + thread_ts);
  if (thread_ts === undefined) return "";

  if (!isAdmin) {
    const conversation = await Conversation.find({ "admin.ts": thread_ts });
    return conversation[0].suppliers.ts;
  }
  const conversation = await Conversation.find({ "suppliers.ts": thread_ts });
  return conversation[0].admin.ts;
};

const recordConversation = async (message, postedMessage, isAdmin) => {
  let adminObject;
  let suppliersObject;
  if (!isAdmin) {
    adminObject = {
      client_msg_id: message.client_msg_id,
      type: message.type,
      text: message.text,
      user: message.user,
      ts: message.ts,
      team: message.team,
      thread_ts: message.thread_ts,
      parent_user_id: message.parent_user_id,
      channel: message.channel,
      event_ts: message.event_ts,
      channel_type: message.channel_type,
      subtype: message.subtype,
      files: message.files,
    };

    suppliersObject = {
      client_msg_id: null,
      type: postedMessage.message.type,
      text: postedMessage.message.text,
      user: postedMessage.message.user,
      ts: postedMessage.ts,
      team: postedMessage.message.team,
      thread_ts: postedMessage.message.thread_ts,
      parent_user_id: null,
      channel: postedMessage.channel,
      event_ts: null,
      channel_type: null,
      subtype: postedMessage.message.subtype,
      files: [{ id: String, permalink_public: String }],
    };
  } else {
    suppliersObject = {
      client_msg_id: message.client_msg_id,
      type: message.type,
      text: message.text,
      user: message.user,
      ts: message.ts,
      team: message.team,
      thread_ts: message.thread_ts,
      parent_user_id: message.parent_user_id,
      channel: message.channel,
      event_ts: message.event_ts,
      channel_type: message.channel_type,
      subtype: message.subtype,
      files: message.files,
    };

    adminObject = {
      client_msg_id: null,
      type: postedMessage.message.type,
      text: postedMessage.message.text,
      user: postedMessage.message.user,
      ts: postedMessage.ts,
      team: postedMessage.message.team,
      thread_ts: postedMessage.message.thread_ts,
      parent_user_id: null,
      channel: postedMessage.channel,
      event_ts: null,
      channel_type: null,
      subtype: postedMessage.message.subtype,
      files: [{ id: String, permalink_public: String }],
    };
  }

  await Conversation.updateOne(
    { _id: message.ts },
    {
      admin: adminObject,
      suppliers: suppliersObject,
    },
    { upsert: true }
  );
};

export const createChannel = async (client, channelName, users) => {
  const newChannels = [];

  for (const item of users) {
    const token = item.bot.token;
    const teamId = item._id;

    await client.conversations
      .create({
        name: channelName,
        token: token,
        team_id: teamId,
      })
      .then((newChannel) => {
        getNonBotUsers(client, teamId, token).then((wsUsers) => {
          const members = [];
          wsUsers.forEach((item) => {
            members.push(item.id);
          });

          client.conversations.invite({
            channel: newChannel.channel.id,
            users: members.join(","),
            token: token,
          });
        });

        let clientInfo = {
          channelId: newChannel.channel.id,
          teamId: teamId,
          channelName: channelName,
        };

        newChannels.push(clientInfo);
      });
  }

  return newChannels;
};
