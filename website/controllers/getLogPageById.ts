import { type ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongo/client';
import { type WebhookLogEntry } from '@/models/WebhookLogEntry';

export async function getLogPageById(id: ObjectId, page = 0): Promise<WebhookLogEntry[]> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const logCollection = db.collection(process.env.MONGODB_COLLECTION_LOGS);
    const logs = await logCollection.find<WebhookLogEntry>({
        ownerId: id
    }).sort({ _id: -1 }).skip(page * 25).limit(25).toArray();

    return logs;
}
