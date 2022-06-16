import { WebhookClient } from 'discord.js';
import WebSocket from 'ws'
import { sendNetworkMessageTo } from './chatServer';
import { log } from './logging/logger';
import { LogLevel } from './logging/logLevel';
import { MessageType } from './network/messageType';
import NetworkMessage from './network/networkMessage';
import { deleteArrayElement } from './util';
import WebhookMessage from './webhookMessage';

export default class ChatRoom {
    private _subscribers: WebSocket[] = []
    
    private _roomName : string;
    public get roomName() : string {
        return this._roomName;
    }
    public set roomName(v : string) {
        this._roomName = v;
    }

    private _motd : string | undefined;
    public get motd() : string | undefined {
        return this._motd;
    }
    public set motd(v : string | undefined) {
        this._motd = v;
    }
    

    private _discordWebhook : WebhookClient | undefined;
    public get discordWebhook() : WebhookClient | undefined {
        return this._discordWebhook;
    }
    public set discordWebhook(v : WebhookClient | undefined) {
        this._discordWebhook = v;
    }

    private _discordChannelId : string | undefined;
    public get discordChannelId() : string | undefined {
        return this._discordChannelId;
    }
    public set discordChannelId(v : string | undefined) {
        this._discordChannelId = v;
    }
    

    constructor(roomName: string, motd: string | undefined, webhookUrl: string | undefined = undefined, discordChannelId: string | undefined = undefined) {
        this._roomName = roomName
        this._motd = motd
        if(webhookUrl)
            this._discordWebhook = new WebhookClient({ url: webhookUrl })
        this._discordChannelId = discordChannelId
    }


    public subscribe(client: WebSocket) {
        this._subscribers.push(client)

        if(this._motd) {
            const motdMsg: NetworkMessage = new NetworkMessage('System', MessageType.MOTD, this._motd)
            sendNetworkMessageTo(motdMsg, [client])
        }
        
        log('Subscribed client to chatroom', LogLevel.DEBUG, this._roomName)
    }


    public unsubscribe(client: WebSocket) {
        if(!client.CLOSING || !client.CLOSED)
            client.close(1000)

        deleteArrayElement(client, this._subscribers)
        log('Unsubscribed client from chatroom', LogLevel.DEBUG, this._roomName)
    }


    public async broadcastMessage(message: NetworkMessage, exclude_clients: [WebSocket] | undefined = undefined) {
        log('broadcastMessage', LogLevel.DEBUG, message, this._roomName)
        
        if(this._discordWebhook && message.messageType !== MessageType.DISCORD_MESSAGE) {
            log('Sending to discord', LogLevel.DEBUG)
            const webhookMessage: WebhookMessage = new WebhookMessage(message.sender, message.messageContent)
            await this._discordWebhook.send(webhookMessage);
        }
        else if(message.messageType === MessageType.DISCORD_MESSAGE)
            message.messageType = MessageType.MESSAGE
        
        const msg = JSON.stringify(message)

        log('Sending to subscribers', LogLevel.DEBUG)
        this._subscribers.forEach(subscriber => {
            if(exclude_clients && exclude_clients.includes(subscriber)) return
            
            subscriber.send(msg)
        });
    }
}