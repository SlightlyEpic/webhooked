'use client';

import Link from 'next/link';
import { Home, Webhook, Cable, FileClock, KeyRound, BookText, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/shadcn/ui/sheet';
import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
    {
        href: '/dashboard',
        icon: Home,
        text: 'Dashboard',
    },
    {
        href: '/dashboard/webhooks',
        icon: Cable,
        text: 'Webhooks',
    },
    {
        href: '/dashboard/logs',
        icon: FileClock,
        text: 'Logs',
    },
    {
        href: '/dashboard/auth',
        icon: KeyRound,
        text: 'Authentication',
    },
];

export function SidebarSheet() {
    const pathname = usePathname();

    return <Sheet>
        <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2">
                {sidebarLinks.map(({ href, icon: Icon, text }) => <Link
                    key={href}
                    href={href}
                    className={cn(
                        '-mx-2 flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-primary transition-all first:mt-4',
                        pathname === href && 'bg-muted',
                    )}
                >
                    <Icon className="h-4 w-4" />
                    {text}
                </Link>)}
            </nav>
            <div className="mt-auto">
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
        </SheetContent>
    </Sheet>;
}