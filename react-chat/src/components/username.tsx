import '../style/username.css'
import { useEffect, useState } from 'react'
import WebhookMessage from '../webhookMessage'

export default function App() {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([''])
    const [websocket] = useState(new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER!))

    useEffect(() => {
        websocket.onopen = () => {
            console.log('Connected')
        }

        websocket.onclose = e => {
            console.log('Disconnected', e.code, e.reason)
        }

        websocket.onerror = err => {
            console.error('Error', err)
        }

        websocket.onmessage = e => {
            console.log('Message', e.data)

            const message: WebhookMessage = JSON.parse(e.data)

            setChatMessages(previousMessages => [
                ...previousMessages, `\n${message.username}: ${message.content}`
            ])
        }
    }, [websocket])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        const webhookMessage: WebhookMessage = new WebhookMessage(name, message)

        websocket.send(JSON.stringify(webhookMessage))

        setChatMessages(previousMessages => [
            ...previousMessages, `\n${name}: ${message}`
        ])
    }
    

    return (
        <div className="wrapper">
        <form onSubmit={handleSubmit}>
        <fieldset>
            <label>
                <p>Username</p>
                <input name="name" onChange={event => setName(event.target.value)} />
            </label>
            <label>
                <p>Message</p>
                <input name="message" onChange={event => setMessage(event.target.value)} />
            </label>
        </fieldset>
        <button type="submit">Submit</button>
        </form>
        <textarea cols={100} rows={50} readOnly value={chatMessages}></textarea>
        </div>
    )
}