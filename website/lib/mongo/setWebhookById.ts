import { type WebhookInfo } from '@/models/WebhookInfo';
import clientPromise from '@/lib/mongo/client';
import { ObjectId } from 'mongodb';

export async function setWebhookById(webhookId: string, webhook: WebhookInfo): Promise<WebhookInfo> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);

    const webhooksCollection = db.collection<WebhookInfo>(process.env.MONGODB_COLLECTION_WEBHOOK);
    const result = await webhooksCollection.replaceOne({
        _id: new ObjectId(webhookId)
    }, webhook);

    if(!result.matchedCount) throw `Webhook not found (id: ${webhookId})`;

    return webhook;
}
