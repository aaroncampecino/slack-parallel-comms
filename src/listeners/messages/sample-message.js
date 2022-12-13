import { User } from "../../database/model/User";
import { Channel } from "../../database/model/Channel";
import { postMessage } from "../../utility/slack_api";
import { download } from "../../utility/download";
const hiCallback = async ({
  context,
  client,
  say,
  body,
  message,
  payload,
  event,
}) => {
  // console.log("context " + context);
  // console.log(JSON.stringify(context));

  // console.log("body " + body);
  // console.log(body);

  // console.log("message " + message);
  // console.log(message);

  const channelId = message.channel;
  const teamId = body.team_id;
  const messageText = message.text;

  const user = await User.findById(teamId);
  const isAdmin = user.isAdmin;

  let filter = {};
  if (isAdmin) filter = { "admin.channelId": channelId };
  else
    filter = { "suppliers.teamId": teamId, "suppliers.channelId": channelId };

  const files = message.files;
  if (files !== undefined) {
    await download(files, user);
  }

  const channel = await Channel.findOne(filter);

  if (channel === null) return;

  let channels = [];
  if (isAdmin) channels.push(channel.suppliers);
  else channels.push(channel.admin);

  await postMessage(
    client,
    channels,
    messageText,
    teamId,
    message,
    user.bot.token
  );
};

module.exports = { hiCallback };
