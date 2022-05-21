# discord-chat-web-integration
Discord text chat integration for web based applications

A quick and dirty POC for integrating discord and web chat using discord webhooks, a bot and websockets.

The webhook is used to send messages to discord as it offers a very easy to use integration and control over how messages are presented in discord over having a bot do the same work.
Even though, a bot is still needed to complete the other end of the link, receiving messages from discord and send them to the integration server.
The integration server is the powerhouse of the system, it is responsible for routing the messages around between discord and the connected web clients using websockets and the aforementioned discord webhook.

In this POC I have matched the websocket traffic with the webhook message options that discord webhooks support, the idea being that integration should be very easy to use and extend.
