import express from 'express'
import WebSocket, { Server } from 'ws'
import http from 'http'
import cors from 'cors'
import ChatRoom from './chatRoom'
import NetworkMessage from './network/networkMessage'
import { MessageType } from './network/messageType'
import { log } from './logging/logger'
import { LogLevel } from './logging/logLevel'
import { ChatroomConfigRoot } from './chatroomConfig'
import { readFile } from 'fs/promises'

const chatRooms: {[name: string]: ChatRoom} = {}
export const discordChatroomDictionary: {[discordChannelId: string]: string} = {}

let wss: Server<WebSocket>

export default async (port: number) => {
    log('test', LogLevel.DEBUG)

    const chatroomJson: ChatroomConfigRoot = JSON.parse(await readFile(process.env.CHATROOM_FILE!, {encoding: 'utf-8'}))

    for (const key in chatroomJson.chatrooms) {
        if (Object.prototype.hasOwnProperty.call(chatroomJson.chatrooms, key)) {
            const chatroom = chatroomJson.chatrooms[key];
            chatRooms[key] = new ChatRoom(key, chatroom.motd, chatroom.discord_webhook)
            discordChatroomDictionary[chatroom.discord_channel_id] = key
            log('Loaded chatroom', LogLevel.INFO, key)
        }
    }

    const app = express()
    
    app.use(cors())

    const server = http.createServer(app)

    wss = new WebSocket.Server({ server })
    
    wss.on('connection', async ws => {
        ws.on('message',async (message: string) => {
            const networkMessage: NetworkMessage = JSON.parse(message)

            if(!networkMessage) return

            await handleNetworkMessage(networkMessage, ws)
        })
    });
    
    server.listen(port, () => {
        log(`WSS listening on port ${port}!`)
    });
}

export const sendChatroomMessage = async (message: NetworkMessage) => {
    log('sendChatroomMessage', LogLevel.DEBUG, message)

    if(!message.targetRoom) return

    await chatRooms[message.targetRoom]?.broadcastMessage(message)
}

export const sendNetworkMessageTo = async (message: NetworkMessage, recipients: [WebSocket]) => {
    log('sendNetworkMessageTo', LogLevel.DEBUG, message)

    const msg = JSON.stringify(message)

    recipients.forEach(recipient => {
        recipient.send(msg)
    })
}

const handleNetworkMessage = async (message: NetworkMessage, sender: WebSocket) => {
    log('handleNetworkMessage', LogLevel.DEBUG, message)

    switch(message.messageType) {
        case MessageType.PING:
            log('PING received', LogLevel.DEBUG)

            const pongMsg: NetworkMessage = new NetworkMessage('System', MessageType.PONG, message.messageContent)

            await sendNetworkMessageTo(pongMsg, [sender])
            return
        case MessageType.ROOM_LIST_REQUEST:
            log('ROOM_LIST_REQUEST received', LogLevel.DEBUG)
            const rooms: string = Object.keys(chatRooms).map((key) => {return `${key}`}).toString()
            const response: NetworkMessage = new NetworkMessage('System', MessageType.ROOM_LIST_RESPONSE, rooms)
            await sendNetworkMessageTo(response, [sender])
            return
        case MessageType.JOIN_ROOM:
            log('JOIN_ROOM received', LogLevel.DEBUG)

            if(!message.targetRoom) return

            chatRooms[message.targetRoom]?.subscribe(sender)
            break
        case MessageType.LEAVE_ROOM:
            log('LEAVE_ROOM Received', LogLevel.DEBUG)

            if(!message.targetRoom) return

            chatRooms[message.targetRoom]?.unsubscribe(sender)
            break
        case MessageType.MESSAGE:
            log('MESSAGE received', LogLevel.DEBUG)

            if(!message.targetRoom || !message.messageContent) return

            await chatRooms[message.targetRoom]?.broadcastMessage(message, [sender])
            break
        default:
            return
    }
}