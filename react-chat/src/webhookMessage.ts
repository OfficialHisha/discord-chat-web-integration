import { MessageEmbed } from "discord.js"

export default class WebhookMessage {
    username: string
    content: string | undefined
    avatar: string | undefined
    embeds: [MessageEmbed] | undefined

    constructor(username: string, content: string | undefined = undefined, avatar: string | undefined = undefined, embeds: [MessageEmbed] | undefined = undefined) {
        this.username = username
        this.content = content
        this.avatar = avatar
        this.embeds = embeds
    }
}