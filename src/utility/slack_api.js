import { User } from "../database/model/User";
import { UserMap } from "../database/model/UserMap";
import { Conversation } from "../database/model/Conversation";
import { deleteFile } from "./download";
import { rotateTokenBeforeUsing } from "../authorize";
let fs = require("fs");

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
  teamId = null,
  message
) => {
  for (const item of channels) {
    const user = await User.findById(item.teamId);
    const isAdmin = user.isAdmin;

    // let filterTeamId = item.teamId;
    // if (isAdmin) filterTeamId = teamId;

    // const userMap = await UserMap.findById(filterTeamId);
    // let username;
    // let iconUrl;

    // if (isAdmin) {
    //   username = userMap.suppliers.mapDisplayName;
    //   iconUrl = userMap.suppliers.mapUserImageOriginal;
    // } else {
    //   username = userMap.admin.mapDisplayName;
    //   iconUrl = userMap.admin.mapUserImageOriginal;
    // }

    const thread_ts = await getThreadTs(message, isAdmin, user);

    const permalinks = await uploadFile(client, user.bot.token, item.channelId);

    const images = permalinks.map((permalink) => `<${permalink}| >`).join("");

    const postedMessage = await client.chat.postMessage({
      channel: item.channelId,
      token: user.bot.token,
      text: `${messageText} ${images}`,
      // text: messageText,
      // username: username,
      // icon_url: iconUrl,
      thread_ts: thread_ts,
    });

    await recordConversation(message, postedMessage, isAdmin);
  }
};

export const uploadFile = async (client, token, channelId) => {
  const path = `${__dirname}/files`;
  let files = fs.readdirSync(path);

  const public_permalink = [];
  for (const file of files) {
    const response = await client.files.upload({
      token: token,
      file: fs.createReadStream(`${path}/${file}`),
    });

    public_permalink.push(response.file.permalink);
  }
  deleteFile();
  return public_permalink;
};

const getThreadTs = async (message, isAdmin) => {
  const thread_ts = message.thread_ts;
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

export const createChannel = async (client, channelName, users, userAdmin) => {
  const newChannels = [];

  for (const item of users) {
    const clientInfo = await createChannels(client, channelName, item);

    const adminInfo = await createChannels(
      client,
      `${item.team.name}-${channelName}`.toLowerCase(),
      userAdmin
    );

    const info = {
      admin: adminInfo,
      suppliers: clientInfo,
    };

    newChannels.push(info);
  }

  return newChannels;
};

const createChannels = async (client, channelName, item) => {
  const token = item.bot.token;
  const teamId = item._id;

  let clientInfo = {};

  const tokenRotate = await rotateTokenBeforeUsing(item);

  await client.conversations
    .create({
      name: channelName,
      token: tokenRotate.botToken,
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

      clientInfo = {
        channelId: newChannel.channel.id,
        teamId: teamId,
        channelName: channelName,
      };
    });

  return clientInfo;
};
