import { Client } from "discord.js";
import { log } from "../logging/logger";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        log(`${client.user.username} is online`);
    });
};