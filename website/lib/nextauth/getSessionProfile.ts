import { type Session, getServerSession } from 'next-auth';
import { type GithubProfile } from 'next-auth/providers/github';

export async function getServerSessionProfile(): Promise<[session: Session | null, profile: GithubProfile | null]> {
    const session = await getServerSession();
    if(!session) return [null, null];

    const user = session.user;
    const profile = user ? JSON.parse(user.name!) as GithubProfile : null;

    return [session, profile];
}
