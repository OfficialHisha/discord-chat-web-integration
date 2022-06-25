export interface ChatroomConfigRoot {
    chatrooms: {[name: string]: ChatroomEntry}
}

export interface ChatroomEntry {
    name: string
    motd: string
    discord_webhook: string
    discord_channel_id: string
}