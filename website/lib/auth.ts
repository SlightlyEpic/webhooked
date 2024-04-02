import type { NextAuthOptions, User } from 'next-auth';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export const config = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            profile(profile: GithubProfile) {
                return {
                    id: profile.id.toString(),
                    // * Why? Because nextauth seemingly cant add additional properties!
                    name: JSON.stringify(profile),
                };
            }
        })
    ],
} satisfies NextAuthOptions;


export function auth(...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, config);
}
