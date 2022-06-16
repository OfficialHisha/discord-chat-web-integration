import 'dotenv/config'
import { Client, Intents } from "discord.js";
import messageCreate from "./discord-listeners/messageCreate";
import ready from "./discord-listeners/ready";
import websocket from "./chatServer";
import { log } from './logging/logger';

export default async function startDiscordClient(clientToken: string) {
    log("Bot is starting...");

    websocket(Number(process.env.WEBSOCKET_PORT!))

    const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
    });
    
    ready(client)
    messageCreate(client)

    await client.login(clientToken)
}