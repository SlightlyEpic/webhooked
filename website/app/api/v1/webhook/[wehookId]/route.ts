import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getWebhookbyId } from '@/lib/mongo/getWebhookById';
import { WebhookInfo, webhookInfoSchema } from '@/models/WebhookInfo';
import { setWebhookById } from '@/lib/mongo/setWebhookById';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

type RouteParams = {
    webhookId: string
};

export type GetWebhookSuccessResponse = {
    data: WebhookInfo
};

export type GetWebhookErrorResponse = {
    error: string
};

export async function GET(req: NextRequest, { params }: { params: RouteParams }) {
    const session = await auth();
    if(!session || !session.user) {
        return NextResponse.json({
            error: 'Not signed in.'
        }, {
            status: 403
        });
    }

    try {
        const webhook = await getWebhookbyId(params.webhookId);
        
        return NextResponse.json({
            data: webhook
        });
    } catch(err) {
        return NextResponse.json({
            error: err
        }, {
            status: 500
        });
    }
}

export type PatchWebhookSuccessResponse = {
    data: WebhookInfo
};

export type PatchWebhookErrorResponse = {
    error: string
};

export async function PATCH(req: NextRequest, { params }: { params: RouteParams }) {
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

    const webhookData: WebhookInfo = {
        ...parseResult.data,
        _id: new ObjectId(params.webhookId),
        owner: new ObjectId(parseResult.data.owner)
    };

    try {
        const updatedWebhook = await setWebhookById(params.webhookId, webhookData);

        return NextResponse.json({
            data: updatedWebhook
        });
    } catch(err) {
        return NextResponse.json({
            error: err
        }, {
            status: 500
        });
    }
}
