import { type WebhookInfo } from '@/models/WebhookInfo';
import clientPromise from '@/lib/mongo/client';
import { ObjectId } from 'mongodb';

export async function getWebhookbyId(webhookId: string): Promise<WebhookInfo> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const webhooksCollection = db.collection<WebhookInfo>(process.env.MONGODB_COLLECTION_WEBHOOK);
    const webhook = await webhooksCollection.findOne({
        _id: new ObjectId(webhookId)
    });

    if(!webhook) throw `Webhook not found (id: ${webhookId})`;

    return webhook;
}
