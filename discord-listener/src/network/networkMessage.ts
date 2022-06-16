import { MessageType } from "./messageType";

export default class NetworkMessage {
    sender: string
    messageType: MessageType
    messageContent: string | undefined
    targetRoom: string | undefined

    constructor(sender: string, messageType: MessageType, messageContent: string | undefined = undefined, targetRoom: string | undefined = undefined) {
        this.sender = sender
        this.messageType = messageType
        this.messageContent = messageContent
        this.targetRoom = targetRoom
    }
}