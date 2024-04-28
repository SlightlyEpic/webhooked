import { type WebhookInfo } from '@/models/WebhookInfo';
import clientPromise from '@/lib/mongo/client';
import { ObjectId } from 'mongodb';
import { User } from '@/models/User';

export async function getUserByName(username: string): Promise<User> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
    
    const usersCollection = db.collection<User>(process.env.MONGODB_COLLECTION_USERS);
    const user = await usersCollection.findOne({
        username: username
    });

    if(!user) throw `User not found (username: ${username})`;

    return user;
}
