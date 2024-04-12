import { type Filter, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongo/client';
import { type WebhookLogEntry } from '@/models/WebhookLogEntry';

export type GetLogPageByIdOptions = {
    page?: number,
    before?: Date,
    after?: Date,
    webhookId?: string
};

export async function getLogPageById(id: ObjectId, options: GetLogPageByIdOptions = {}): Promise<WebhookLogEntry[]> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const logCollection = db.collection<WebhookLogEntry>(process.env.MONGODB_COLLECTION_LOGS);

    options.page ??= 0;

    let filter: Filter<WebhookLogEntry> = { ownerId: id };
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

    const logs = await logCollection.find(filter)
        .sort({ _id: -1 })
        .skip(options.page * 25)
        .limit(25)
        .toArray();

    return logs;
}
