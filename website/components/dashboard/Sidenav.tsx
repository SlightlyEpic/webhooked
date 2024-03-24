'use client';

import { redirect } from 'next/navigation';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { IoLogOutOutline } from 'react-icons/io5';
import { IoIosSettings } from 'react-icons/io';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { IoGitBranchOutline } from 'react-icons/io5';

function UserButton() {
    const { data: session } = useSession();
    // console.log(session)
    if (!session) {
        redirect('/login');
    }

    return <>
        <Popover>
            <PopoverTrigger className='w-full'>
                <div className='flex gap-2 m-2 p-2 rounded-md items-center hover:bg-zinc-800'>
                    <Image src={session?.user?.image || ''} alt="user avatar" width={20} height={10} className='w-4 h-4 rounded-full inline' />
                    <p className='m-0 text-sm'>{session?.user?.name}</p>
                </div>
            </PopoverTrigger>
            <PopoverContent side='right' className='bg-zinc-800 w-full p-0 my-2 border-zinc-600'>
                <div className='text-xs px-4 py-2 text-white'>
                    <p>{session?.user?.name}</p>
                    <p className='text-zinc-200'>{session?.user?.email}</p>
                </div>
                <hr className='border-zinc-600' />
                <Button className='flex gap-2 bg-transparent text-xs w-full justify-start'>
                    <IoIosSettings />
                    <p>Account settings</p>
                </Button>
                <Button onClick={() => signOut({ callbackUrl: '/login' })} className='flex gap-2 bg-transparent text-xs w-full justify-start'>
                    <IoLogOutOutline />
                    <p>Sign out</p>
                </Button>
            </PopoverContent>
        </Popover>
    </>;
}

function DocsButton() {
    return <a className='text-left gap-2 items-center flex p-2 m-2 rounded-md hover:bg-zinc-800' href='/docs'>
        <IoDocumentTextOutline />
        <span>Documentation</span>
    </a>;
}


export default function Sidenav() {
    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col justify-between text-white text-sm">
            <div>
                <div className='h-10 bg-zinc-800 text-sm justify-center items-center flex'>Workspace name</div>
                <hr />
                <p className='p-2 m-2 pb-0 mb-0 text-xs'>Configure</p>
                <div className='flex gap-2 p-2 m-2 '>
                    <IoGitBranchOutline className='rotate-90 text-xl' />
                    <p>Connections</p>
                </div>
            </div>
            <div>
                <DocsButton />
                <UserButton />
            </div>
        </div>
    );
}