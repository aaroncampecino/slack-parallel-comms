import { User } from "../../database/model/User";
import { Channel } from "../../database/model/Channel";
import { createChannel, postMessage } from "../../utility/slack_api";
import { modals } from "../../user-interface";

const notifyWorkspaceCallback = async ({ ack, view, body, client }) => {
  await ack();

  const providedValues = view.state.values;
  // console.log(providedValues);
  const channelName =
    providedValues.channelName.channelName.selected_option.value;
  const messageText = providedValues.messageId.messageId.value;

  console.log(channelName);
  console.log(messageText);

  const channels = await Channel.find({
    "suppliers.channelName": channelName,
  });

  console.log(channels);

  const userAdmin = await User.find({ isAdmin: true });

  try {
    for (const channel of channels) {
      const textMessage = `<!channel> ${messageText}`;

      const user = await User.findById(channel.suppliers.teamId);
      const postedMessage = await client.chat.postMessage({
        channel: channel.admin.channelId,
        token: userAdmin[0].bot.token,
        text: textMessage,
        username: "aaron-gwapo",
      });

      const channelData = [];
      channelData.push(channel.suppliers);

      await postMessage(
        client,
        channelData,
        textMessage,
        null,
        postedMessage,
        user.bot.token
      );
    }
  } catch (error) {
    console.error(`${error}`);
    // const errorMsg = error.data.error;
    // let message = errorMsg;
    // if (errorMsg === "name_taken") message = "Channel is already taken.";

    // await client.views.open({
    //   trigger_id: body.trigger_id,
    //   view: modals.modalInfo(
    //     "SDJ Services",
    //     "temp_callback",
    //     message,
    //     ":warning:"
    //   ),
    // });
  }
};

module.exports = { notifyWorkspaceCallback };
