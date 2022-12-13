import { User } from "../../database/model/User";
import { Channel } from "../../database/model/Channel";
import { createChannel } from "../../utility/slack_api";
import { modals } from "../../user-interface";

const createChannelCallback = async ({ ack, view, body, client }) => {
  await ack();

  const providedValues = view.state.values;

  const channelName = providedValues.channelNameId.channelNameId.value;

  const users = await User.find({ isAdmin: false });
  const adminUser = await User.find({ isAdmin: true });

  try {
    await createChannel(client, channelName, users, adminUser[0]).then(
      (channels) => {
        for (const channel of channels) {
          Channel.create(channel);
        }
      }
    );
  } catch (error) {
    const errorMsg = error.data.error;
    let message = errorMsg;
    if (errorMsg === "name_taken") message = "Channel is already taken.";

    await client.views.open({
      trigger_id: body.trigger_id,
      view: modals.modalInfo(
        "SDJ Services",
        "temp_callback",
        message,
        ":warning:"
      ),
    });
  }
};

module.exports = { createChannelCallback };
