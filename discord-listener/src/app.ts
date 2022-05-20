import 'dotenv/config'
import startDiscordClient from "./discord";

async function main() {
    await startDiscordClient(process.env.DISCORD_TOKEN!)
}

main()