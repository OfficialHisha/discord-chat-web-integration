import express from 'express'
import WebSocket, { Server } from 'ws'
import http from 'http'
import cors from 'cors'
import { sendWebhookMessage } from './webhook'
import WebhookMessage from './webhookMessage'

const subscribers: Array<WebSocket> = new Array<WebSocket>()
let wss: Server<WebSocket>

export default async (port: number) => {
    const app = express()
    
    app.use(cors())

    const server = http.createServer(app)
    
    wss = new WebSocket.Server({ server })
    
    wss.on('connection', async ws => {
        ws.on('message',async (message: string) => {
            const webhookMessage: WebhookMessage = JSON.parse(message)
            
            sendWebhookMessage(webhookMessage)
        })

        subscribers.push(ws)

        const webhookMessage: WebhookMessage = new WebhookMessage('System', 'Connected to Discord integration')

        ws.send(JSON.stringify(webhookMessage))
    });
    
    server.listen(port, () => {
        console.log(`WSS listening on port ${port}!`)
    });
}

export const sendSocketMessage = async (message: WebhookMessage) => {
    if (wss === null) {
        console.error('Websocket is not initialized!')
        return
    }
    
    console.log('Sending message "%s" to subscribers', message)

    const jsonMessage = JSON.stringify(message)

    subscribers.forEach(subscriber => {
        subscriber.send(jsonMessage)
    });
}