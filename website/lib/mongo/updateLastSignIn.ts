import clientPromise from '@/lib/mongo/client';
import { ObjectId } from 'mongodb';
import { User } from '@/models/User';

export async function updateLastSignIn(id: ObjectId): Promise<void> {
    const db = (await clientPromise).db(process.env.MONGODB_DATBASE);

    const usersCollection = db.collection<User>(process.env.MONGODB_COLLECTION_USERS);
    const result = await usersCollection.updateOne({ _id: id }, {
        $set: {
            lastSignIn: new Date()
        }
    });

    if(!result.modifiedCount) throw 'Failed to update last sign in. User not found';
}
