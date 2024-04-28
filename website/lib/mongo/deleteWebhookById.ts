import { type WebhookInfo } from '@/models/WebhookInfo';
import clientPromise from '@/lib/mongo/client';
import { ObjectId } from 'mongodb';

export async function deleteWebhookbyId(webhookId: string): Promise<void> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const webhooksCollection = db.collection<WebhookInfo>(process.env.MONGODB_COLLECTION_WEBHOOK);
    console.log('deleting:', webhookId)
    const result = await webhooksCollection.deleteOne({
        _id: new ObjectId(webhookId)
    });

    if(!result.deletedCount) throw `Webhook not found (id: ${webhookId})`;
}
