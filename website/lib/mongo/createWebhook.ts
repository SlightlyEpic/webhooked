import { type WebhookInfo } from '@/models/WebhookInfo';
import clientPromise from '@/lib/mongo/client';
import { ObjectId, WithoutId } from 'mongodb';

export async function createWebhook(webhook: WithoutId<WebhookInfo>): Promise<ObjectId> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);

    const webhooksCollection = db.collection<WithoutId<WebhookInfo>>(process.env.MONGODB_COLLECTION_WEBHOOK);
    const result = await webhooksCollection.insertOne(webhook);

    if(!result.insertedId) throw 'DB Error. Webhook not created';

    return result.insertedId;
}
