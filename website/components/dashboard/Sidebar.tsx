'use client';

import Link from 'next/link';
import { Home, Webhook, Cable, FileClock, KeyRound, BookText } from 'lucide-react';
import { Button } from '@/components/shadcn/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const sidebarLinks = [
    {
        href: '/dashboard',
        icon: Home,
        text: 'Dashboard',
    },
    {
        href: '/webhooks',
        icon: Cable,
        text: 'Webhooks',
    },
    {
        href: '/logs',
        icon: FileClock,
        text: 'Logs',
    },
    {
        href: '/authentication',
        icon: KeyRound,
        text: 'Authentication',
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Webhook className="h-6 w-6" />
                        <span className="">Webhooked</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {sidebarLinks.map(({ href, icon: Icon, text }) => <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                pathname === href && 'bg-muted',
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {text}
                        </Link>)}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Button className='w-full'>
                        <Link
                            href='/guide'
                            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                        >
                            <BookText className="h-4 w-4" />
                            Guide
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
