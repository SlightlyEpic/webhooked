import clientPromise from '@/lib/mongo/client';
import { type WebhookLogEntry } from '@/models/WebhookLogEntry';
import { type User } from '@/models/User';

export async function getLogPageByName(username: string, page = 0): Promise<WebhookLogEntry[]> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const userCollection = db.collection(process.env.MONGODB_COLLECTION_USERS);
    const userDoc = await userCollection.findOne<User>({ username });
    if(!userDoc) throw 'User not found';

    const logCollection = db.collection(process.env.MONGODB_COLLECTION_LOGS);
    const logs = await logCollection.find<WebhookLogEntry>({
        ownerId: userDoc._id
    }).sort({ _id: -1 }).skip(page * 25).limit(25).toArray();

    return logs;
}
