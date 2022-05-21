import express from 'express'
import WebSocket, { Server } from 'ws'
import http from 'http'
import cors from 'cors'
import { sendWebhookMessage } from './webhook'
import WebhookMessage from './webhookMessage'

const subscribers: WebSocket[] = []
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
            sendRawSocketMessage(message.toString(), [ws])
        })

        subscribers.push(ws)

        const webhookMessage: WebhookMessage = new WebhookMessage('System', 'Connected to Discord integration')

        ws.send(JSON.stringify(webhookMessage))
    });
    
    server.listen(port, () => {
        console.log(`WSS listening on port ${port}!`)
    });
}

export const sendSocketMessage = async (message: WebhookMessage, exclude_clients: [WebSocket] | undefined = undefined) => {
    if (wss === null) {
        console.error('Websocket is not initialized!')
        return
    }
    
    console.log('Sending message "%s" to subscribers', message)

    await sendRawSocketMessage(JSON.stringify(message), exclude_clients)

}

const sendRawSocketMessage = async (message: string, exclude_clients: [WebSocket] | undefined = undefined) => {
    subscribers.forEach(subscriber => {
        if(exclude_clients && exclude_clients.includes(subscriber)) return
        
        subscriber.send(message)
    });
}