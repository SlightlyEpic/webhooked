import type { NextAuthOptions } from 'next-auth';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export interface ExtendedGithubProfile {
    id: string
    name: string | null
    username: string
    email: string | null
    image: string
};

export const config = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            profile(profile: GithubProfile): ExtendedGithubProfile {
                return {
                    id: profile.id.toString(),
                    name: profile.name,
                    username: profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                };
            }
        })
    ],
} satisfies NextAuthOptions;


export function auth(...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, config);
}
