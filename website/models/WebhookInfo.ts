import { ObjectId } from 'mongodb';

export type WebhookInfo = {
    _id: ObjectId
    name: string
    destinationUrls: string[]
    log: Date[]
    owner: ObjectId
    active: boolean
    archived: boolean
    created: Date
};
