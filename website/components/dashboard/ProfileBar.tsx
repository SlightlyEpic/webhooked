'use client';

import { useSession } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '../shadcn/ui/avatar';
import { Badge } from '../shadcn/ui/badge';
import { type GithubProfile } from 'next-auth/providers/github';
import { useMemo } from 'react';

export default function ProfileBar() {
    const { data: session } = useSession();
    const user = session!.user;
    const profile = useMemo((): GithubProfile | null => user ? JSON.parse(user.name!) : null, [user]);

    if(!user) return <></>;
    if(!profile) return <></>;

    const avatarFallback = profile.login ? profile.login.split(' ').map(v => v[0].toUpperCase()).slice(0, 2).join() : '?';

    let censoredEmail = '';
    if(profile.email) {
        let idx = profile.email.indexOf('@');
        censoredEmail += new Array(Math.floor(idx / 2)).fill('*').join('');
        censoredEmail += profile.email.substring(Math.floor(idx / 2));
    }
    
    // Fixed (kind of): BUG: This doesnt appear to use the custom profile for some reason, even though that is called

    return <div className='flex gap-4 items-center w-full backdrop-blur-lg border-muted border bg-background/70 h-24 rounded-md p-4 lg:-mt-16 z-10'>
        <Avatar className='h-16 w-16'>
            <AvatarImage src='https://avatars.githubusercontent.com/u/42976178?v=4' alt='avatar' />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
            <div className='text-2xl font-medium font-mono'>{profile.name}</div>
            <div className='font-medium font-mono text-foreground/50'>{profile.login ?? ''}</div>
        </div>
        <div className='ml-auto hidden sm:flex gap-4'>
            <Badge className='items-center'>5 Active</Badge>
            <Badge variant='outline'>1 Inactive</Badge>
        </div>
    </div>;
}
