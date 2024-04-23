import clientPromise from '@/lib/mongo/client';
import { User } from '@/models/User';
import { type WebhookLogEntry } from '@/models/WebhookLogEntry';

export async function getLogById(ownerId: string, id: Date): Promise<WebhookLogEntry> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const logCollection = db.collection<WebhookLogEntry>(process.env.MONGODB_COLLECTION_LOGS);

    const log = await logCollection.findOne({ _id: id });
    if(!log) throw 'Invalid Id';

    const usersCollection = db.collection<User>(process.env.MONGODB_COLLECTION_USERS);
    const owner = await usersCollection.findOne({ _id: log.ownerId });

    if(!owner) throw 'Could not match owner';
    if(owner._id.toHexString() !== ownerId) throw 'Invalid Id';

    return log;
}
