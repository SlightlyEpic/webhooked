import { auth } from '@/lib/auth';
import { createWebhook } from '@/lib/mongo/createWebhook';
import { getUserByName } from '@/lib/mongo/getUserByName';
import { getServerSessionProfile } from '@/lib/nextauth/getSessionProfile';
import { WebhookInfo, newWebhookInfoSchema } from '@/models/WebhookInfo';
import { ObjectId, WithoutId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export type PostWebhookSuccessResponse = {
    data: string
};

export type PostWebhookErrorResponse = {
    error: string
};

export async function POST(req: NextRequest) {
    const [session, profile] = await getServerSessionProfile();
    if(!session || !session.user || !profile) {
        return NextResponse.json({
            error: 'Not signed in.'
        }, {
            status: 403
        });
    }

    const body = await req.json() as unknown;
    const parseResult = newWebhookInfoSchema.safeParse(body);

    if(!parseResult.success) {
        return NextResponse.json({
            error: parseResult.error.message
        }, {
            status: 400
        });
    }

    try {
        const owner = await getUserByName(profile.login);
    
        const webhookData: WithoutId<WebhookInfo> = {
            ...parseResult.data,
            ownerId: owner._id,
            active: true,
            archived: false,
            created: new Date()
        };

        const webhookId = await createWebhook(webhookData);

        return NextResponse.json({
            data: webhookId.toHexString()
        });
    } catch(err) {
        return NextResponse.json({
            error: err
        }, {
            status: 500
        });
    }
}