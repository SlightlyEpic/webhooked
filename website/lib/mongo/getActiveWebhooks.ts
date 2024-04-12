import { type WebhookInfo } from '@/models/WebhookInfo';
import { type User } from '@/models/User';
import clientPromise from '@/lib/mongo/client';

export async function getActiveWebhooks(username: string): Promise<WebhookInfo[]> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const userCollection = db.collection<User>(process.env.MONGODB_COLLECTION_USERS);
    const userDoc = await userCollection.findOne({ username });
    if(!userDoc) throw 'User not found';

    const webhooksCollection = db.collection<WebhookInfo>(process.env.MONGODB_COLLECTION_WEBHOOK);
    const webhooks = await webhooksCollection.find({
        ownerId: userDoc._id,
        active: true,
        archived: false
    }).toArray();

    return webhooks;
}
