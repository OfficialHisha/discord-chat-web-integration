export enum MessageType {
    PING,
    PONG,
    MOTD,
    DISCORD_MESSAGE,// Only used by the server to distinguish source of messages, not broadcasted!
    MESSAGE,
    JOIN_ROOM,
    LEAVE_ROOM
}