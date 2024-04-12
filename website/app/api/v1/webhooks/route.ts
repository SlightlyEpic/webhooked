import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GithubProfile } from 'next-auth/providers/github';
import { getActiveWebhooks } from '@/lib/mongo/getActiveWebhooks';
import { WebhookInfo } from '@/models/WebhookInfo';
import { type MakeStringType } from '@/lib/util/types';

export const dynamic = 'force-dynamic';

export type GetWebhooksSuccessResponse = {
    data: MakeStringType<WebhookInfo, '_id' | 'owner'>[]
};

export type GetWebhooksErrorResponse = {
    error: string
};

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

    try {
        const webhooks = await getActiveWebhooks(profile.login);
        
        return NextResponse.json({
            data: webhooks
        });
    } catch(err) {
        return NextResponse.json({
            error: err
        }, {
            status: 500
        });
    }
}
