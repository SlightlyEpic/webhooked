import type { NextAuthOptions } from 'next-auth';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getUserByName } from './mongo/getUserByName';
import { WithoutId } from 'mongodb';
import { User } from '@/models/User';
import { createUser } from './mongo/createUser';
import { updateLastSignIn } from './mongo/updateLastSignIn';
import { randomKey } from './util/string';

export const config = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            async profile(profile: GithubProfile) {
                try {
                    const user = await getUserByName(profile.login);
                    try {
                        await updateLastSignIn(user._id);
                    } catch(err) {}
                } catch(err) {
                    // If user doesnt exist
                    const user: WithoutId<User> = {
                        username: profile.login,
                        apiKey: randomKey(),
                        avatar: profile.avatar_url,
                        registeredAt: new Date(),
                        lastSignIn: new Date(),
                        deletedWebhooks: [],
                        webhooks: []
                    };

                    try {
                        await createUser(user);
                    } catch(err) {}
                }

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
