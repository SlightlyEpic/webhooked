import { ObjectId } from 'mongodb';

export type User = {
    _id: ObjectId
    username: string
    avatar: string
    registeredAt: Date
    lastSignIn: Date
    webhooks: ObjectId[]
    deletedWebhooks: ObjectId[]
};
