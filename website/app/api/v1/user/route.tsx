import { getUserByName } from '@/lib/mongo/getUserByName';
import { getServerSessionProfile } from '@/lib/nextauth/getSessionProfile';
import { MakeStringType } from '@/lib/util/types';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export type GetUserSuccessResponse = {
    data: MakeStringType<User, 'registeredAt' | 'lastSignIn' | '_id' | 'webhooks' | 'deletedWebhook'>
};

export type GetUserErrorResponse = {
    error: string
};

export async function GET() {
    const [session, profile] = await getServerSessionProfile();
    if(!session || !session.user || !profile) {
        return NextResponse.json({
            error: 'Not signed in.'
        }, {
            status: 403
        });
    }

    try {
        const user = await getUserByName(profile.login);
        
        return NextResponse.json({
            data: user
        });
    } catch(err) {
        return NextResponse.json({
            error: err
        }, {
            status: 500
        });
    }
}
