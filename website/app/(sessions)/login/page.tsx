'use client';

import { Button } from '@/components/ui/button';
import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const Home: NextPage = () => {
    const { data: session } = useSession();
    if (session) {
        redirect('/dashboard')
    }
    return (
        <div className='flex justify-center items-center min-h-screen relative overflow-clip'>
            <Image src='/dark-wallpaper.svg' alt='background' fill className='object-cover absolute -z-10 scale-[1.001]' />
            <div>
                <div className='bg-zinc-100 p-4 gap-6 flex flex-col justify-between rounded relative text-center items-center'>
                    <p className='text-white font-bold text-3xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] p-2 text-center absolute -top-12 w-full'>Webhooked</p>
                    <h1 >Sign in to your account</h1>
                    <Button onClick={() => signIn('github', { callbackUrl: '/dashboard' })} className='bg-green-700 hover:bg-green-700 hover:border-black border-2 gap-1'>
                        <Image src="/icons/github.svg" width={15} height={15} alt="github logo" />
                        Sign in with Github
                    </Button>
                </div>
                <p className='absolute bottom-0 right-0 p-2 text-xs text-white/50'>
                    Background by <a href='https://www.figma.com/@sael' className='underline'>Ryan Sael</a> licensed under <a href='https://creativecommons.org/licenses/by/4.0/' className='underline'>CC 4.0</a>
                </p>
            </div>
        </div>
    );
};

export default Home;