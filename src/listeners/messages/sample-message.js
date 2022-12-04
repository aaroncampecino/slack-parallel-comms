import { User } from "../../database/model/User";
import { Channel } from "../../database/model/Channel";
import { postMessage } from "../../utility/slack_api";
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

  console.log("body " + body);
  console.log(body);

  console.log("message " + message);
  console.log(message);

  const channelId = message.channel;
  const teamId = body.team_id;
  const messageText = message.text;

  const user = await User.findById(teamId);
  const isAdmin = user.isAdmin;

  let filter = {};
  if (isAdmin) filter = { "admin.channelId": channelId };
  else
    filter = { "suppliers.teamId": teamId, "suppliers.channelId": channelId };

  const channel = await Channel.findOne(filter);

  //if message is coming from admin workspace, send message to all supplier workspaces
  //if message is coming from supplier workspaces, send message to admin workspace only

  let channels = [];
  if (isAdmin) channels.push(channel.suppliers);
  else channels.push(channel.admin);

  await postMessage(client, channels, messageText, teamId, message);
};

module.exports = { hiCallback };
