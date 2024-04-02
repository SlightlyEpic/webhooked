import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo/client';
import { auth } from '@/lib/auth';
import { GithubProfile } from 'next-auth/providers/github';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const session = await auth();
    if(!session || !session.user) {
        return NextResponse.json({
            error: 'Not signed in.'
        }, {
            status: 403
        });
    }

    const profile = JSON.parse(session.user.name!) as GithubProfile;
    
    const searchParams = req.nextUrl.searchParams;
    // @ts-expect-error It will just be NaN if the param is null
    let page: number = parseInt(searchParams.get('page'));
    if(isNaN(page)) page = 0;

    try {
        const db = (await clientPromise).db(process.env.MONGODB_DATBASE);
        const userCollection = db.collection(process.env.MONGODB_COLLECTION_USERS);
        const userDoc = await userCollection.findOne<User>({
            username: profile.login
        });
        
        if(!userDoc) {
            return NextResponse.json({
                error: 'User not found.'
            }, {
                status: 400
            });
        }

        const logCollection = db.collection(process.env.MONGODB_COLLECTION_LOGS);
        const logs = await logCollection.find({
            ownerId: userDoc._id
        }).sort({ _id: -1 }).skip(page * 100).limit(100).toArray();
        
        return NextResponse.json({
            page,
            data: logs
        });
    } catch(err) {
        return NextResponse.json({
            error: err
        }, {
            status: 500
        });
    }
}
