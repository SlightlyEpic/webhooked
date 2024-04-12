import { type WebhookInfo } from '@/models/WebhookInfo';
import { type User } from '@/models/User';
import clientPromise from '@/lib/mongo/client';

export async function getAllWebhooks(username: string): Promise<WebhookInfo[]> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const userCollection = db.collection<User>(process.env.MONGODB_COLLECTION_WEBHOOK);
    const userDoc = await userCollection.findOne({ username });
    if(!userDoc) throw 'User not found';

    const webhooksCollection = db.collection<WebhookInfo>(process.env.MONGODB_COLLECTION_WEBHOOK);
    const webhooks = await webhooksCollection.find({
        ownerId: userDoc._id,
    }).toArray();

    return webhooks;
}
