import { WebhookClient } from 'discord.js';
import webhookMessage from './webhookMessage';

let webhookClient: WebhookClient

export default async (webhookUrl: string) => {
    webhookClient = new WebhookClient({ url: webhookUrl });

    console.log('Webhook client initiated')
}

export async function sendWebhookMessage(message: webhookMessage) {
    console.log('Sending message "%s" to discord', message)

    webhookClient.send(message);
}