import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GithubProfile } from 'next-auth/providers/github';
import { z } from 'zod';
import { WebhookLogEntry } from '@/models/WebhookLogEntry';
import { MakeStringType } from '@/lib/util/types';
import { getLogById } from '@/lib/mongo/getLogById';

export const dynamic = 'force-dynamic';

const paramsSchema = z.object({
    logId: z.string(),
});

type RouteParams = {
    logId: string
};

export type GetLogSuccessResponse = {
    data: MakeStringType<WebhookLogEntry, '_id' | 'webhookId' | 'ownerId'>
};

export type GetLogErrorResponse = {
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

    const params = Object.fromEntries(req.nextUrl.searchParams) as RouteParams;
    let parseResult = paramsSchema.safeParse(params);

    if(!parseResult.success) {
        return NextResponse.json({
            error: parseResult.error.message
        }, {
            status: 400
        });
    }

    try {
        const log = await getLogById(profile.login, new Date(params.logId));
        
        return NextResponse.json({
            data: log
        });
    } catch(err) {
        return NextResponse.json({
            error: err
        }, {
            status: 500
        });
    }
}
