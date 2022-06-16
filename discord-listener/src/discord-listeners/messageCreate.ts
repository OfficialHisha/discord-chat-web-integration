import { Client, Message } from "discord.js";
import { discordChatroomDictionary, sendChatroomMessage } from "../chatServer";
import { MessageType } from "../network/messageType";
import NetworkMessage from "../network/networkMessage";

export default (client: Client): void => {
    client.on("messageCreate", async message => {
        if (message.webhookId || !client.user || !client.application) {
            return;
        }

        await handleMessage(message)
    });
};

const handleMessage = async (message: Message): Promise<void> => {
    const networkMessage: NetworkMessage = new NetworkMessage(message.author.username, MessageType.DISCORD_MESSAGE, message.content, discordChatroomDictionary[message.channelId])

    await sendChatroomMessage(networkMessage)
};