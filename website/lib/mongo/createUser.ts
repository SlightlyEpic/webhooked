import clientPromise from '@/lib/mongo/client';
import { WithoutId } from 'mongodb';
import { User } from '@/models/User';

export async function createUser(user: WithoutId<User>): Promise<void> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);

    const usersCollection = db.collection<User>(process.env.MONGODB_COLLECTION_USERS);
    const result = await usersCollection.insertOne(user as User);

    if(!result.insertedId) throw 'Insert failed';
}
