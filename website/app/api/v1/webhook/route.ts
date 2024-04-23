import { auth } from '@/lib/auth';
import { createWebhook } from '@/lib/mongo/createWebhook';
import { webhookInfoSchema, WebhookInfo } from '@/models/WebhookInfo';
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
    const session = await auth();
    if(!session || !session.user) {
        return NextResponse.json({
            error: 'Not signed in.'
        }, {
            status: 403
        });
    }

    const body = await req.json() as unknown;
    const parseResult = webhookInfoSchema.safeParse(body);

    if(!parseResult.success) {
        return NextResponse.json({
            error: parseResult.error.message
        }, {
            status: 400
        });
    }

    const webhookData: WithoutId<WebhookInfo> = {
        ...parseResult.data,
        owner: new ObjectId(parseResult.data.owner)
    };

    try {
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