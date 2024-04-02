import { ObjectId } from 'mongodb';

export type WebhookLogEntry = {
    _id: Date
    webhookId: ObjectId
    senderIp: string
    ownerId: ObjectId
    data: unknown
    successfulForwards: number
};
