import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GithubProfile } from 'next-auth/providers/github';
import { getLogPageByName, type GetLogPageByNameOptions } from '@/lib/mongo/getLogPageByName';
import { z } from 'zod';
import { WebhookLogEntry } from '@/models/WebhookLogEntry';
import { MakeStringType } from '@/lib/util/types';

export const dynamic = 'force-dynamic';

const paramsSchema = z.object({
    webhookId: z.optional(z.string()),
    after: z.optional(z.coerce.number().positive().int()),
    before: z.optional(z.coerce.number().positive().int()),
    page: z.optional(z.coerce.number().nonnegative().int()),
});

type RouteParams = {
    webhookId?: string
    after?: string
    before?: string
    page?: string
};

export type GetLogsSuccessResponse = {
    page: number
    data: MakeStringType<WebhookLogEntry, 'webhookId' | 'ownerId'>[]
};

export type GetLogsErrorResponse = {
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

    let parseResult = paramsSchema.safeParse(req.nextUrl.searchParams);

    if(!parseResult.success) {
        return NextResponse.json({
            error: parseResult.error.message
        }, {
            status: 400
        });
    }

    const params = req.nextUrl.searchParams as RouteParams;

    const options: GetLogPageByNameOptions = {};
    options.page = params.page ? parseInt(params.page) : 0;
    if(params.before) options.before = new Date(parseInt(params.before));
    if(params.after) options.after = new Date(parseInt(params.after));
    if(params.webhookId) options.webhookId = params.webhookId;

    try {
        const logs = getLogPageByName(profile.login, options);
        
        return NextResponse.json({
            page: options.page,
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
