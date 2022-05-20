import 'dotenv/config'
import { Client, Intents } from "discord.js";
import messageCreate from "./discord-listeners/messageCreate";
import ready from "./discord-listeners/ready";
import webhook from "./webhook";
import websocket from "./websocket";

export default async function startDiscordClient(clientToken: string) {
    console.log("Bot is starting...");

    webhook(process.env.DISCORD_WEBHOOK!)
    websocket(Number(process.env.WEBSOCKET_PORT!))

    const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
    });
    
    ready(client)
    messageCreate(client)

    await client.login(clientToken)
}