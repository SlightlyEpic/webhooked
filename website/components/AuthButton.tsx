'use client';

import { Button } from './ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
    const { data: session } = useSession();

    if (!session) {
        return <>
            <div>Not signed in</div>
            <Button onClick={() => signIn('github')}>Sign in</Button>
        </>;
    }

    return <>
        <div>{session?.user?.name}</div>
        <Button onClick={() => signOut()}>Sign out</Button>
    </>;
}
