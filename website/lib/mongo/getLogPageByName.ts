import clientPromise from '@/lib/mongo/client';
import { type WebhookLogEntry } from '@/models/WebhookLogEntry';
import { type User } from '@/models/User';
import { type Filter, ObjectId } from 'mongodb';

export type GetLogPageByNameOptions = {
    page?: number,
    before?: Date,
    after?: Date,
    webhookId?: string
};

export async function getLogPageByName(username: string, options: GetLogPageByNameOptions = {}): Promise<WebhookLogEntry[]> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const userCollection = db.collection<User>(process.env.MONGODB_COLLECTION_USERS);
    const userDoc = await userCollection.findOne({ username });
    if(!userDoc) throw 'User not found';

    options.page ??= 0;

    let filter: Filter<WebhookLogEntry> = { ownerId: userDoc._id };
    if(options.before) {
        filter._id ??= {};
        // @ts-expect-error Dont know why this isnt typed properly
        filter._id.$lte = options.before;
    }
    if(options.after) {
        filter._id ??= {};
        // @ts-expect-error Dont know why this isnt typed properly
        filter._id.$gte = options.after;
    }
    if(options.webhookId) {
        filter.webhookId = new ObjectId(options.webhookId);
    }

    const logCollection = db.collection<WebhookLogEntry>(process.env.MONGODB_COLLECTION_LOGS);

    const logs = await logCollection.find(filter)
        .sort({ _id: -1 })
        .skip(options.page * 25)
        .limit(25)
        .toArray();

    return logs;
}
