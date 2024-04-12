import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GithubProfile } from 'next-auth/providers/github';
import { getLogPageByName } from '@/lib/mongo/getLogPageByName';

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
        const logs = getLogPageByName(profile.login, page);
        
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
