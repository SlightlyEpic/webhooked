import { ObjectId } from 'mongodb';

export type WebhookLogEntry = {
    _id: Date
    webhookId: ObjectId
    senderIp: string
    data: unknown
    successfulForwards: number
};
