import { User } from "../database/model/User";
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

export const postMessage = async (client, channels, message) => {
  for (const item of channels) {
    console.log("item " + JSON.stringify(item));
    const user = await User.findById(item.teamId);

    await client.chat.postMessage({
      channel: item.channelId,
      token: user.bot.token,
      text: message,
    });
  }
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
