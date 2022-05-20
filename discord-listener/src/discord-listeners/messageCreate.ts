import { Client, Message } from "discord.js";
import WebhookMessage from "../webhookMessage";
import { sendSocketMessage } from "../websocket";

export default (client: Client): void => {
    client.on("messageCreate", async message => {
        if (message.webhookId || !client.user || !client.application) {
            return;
        }

        await handleMessage(message)
    });
};

const handleMessage = async (message: Message): Promise<void> => {
    console.log(message)

    const webhookMessage: WebhookMessage = new WebhookMessage(message.author.username, message.content)

    sendSocketMessage(webhookMessage)
};