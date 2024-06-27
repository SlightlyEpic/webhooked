'use client';

import { CircleUser } from 'lucide-react';
import { SidebarSheet } from '@/components/dashboard/SidebarSheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu';
import { Button } from '@/components/shadcn/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/ui/avatar';
import { useSession } from 'next-auth/react';

export default function Header() {
    const { data: session } = useSession();
    const profile = JSON.parse(session?.user?.name ?? '{}');

    return <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 shrink-0">
        <SidebarSheet />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="ml-auto rounded-full">
                    <Avatar>
                        <AvatarImage src='https://avatars.githubusercontent.com/u/42976178?v=4' alt='avatar' />
                        <AvatarFallback>{profile?.login ? profile.login[0] : ''}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href='/user'>
                    <DropdownMenuItem className='cursor-pointer'>
                        Settings
                    </DropdownMenuItem>
                </Link>
                <Link href='/api/auth/signout'>
                    <DropdownMenuItem className='cursor-pointer'>
                        <div className='text-rose-500 font-medium'>Logout</div>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    </header>;
}