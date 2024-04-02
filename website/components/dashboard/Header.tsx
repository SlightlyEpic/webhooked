import { CircleUser, Search } from 'lucide-react';
import { SidebarSheet } from '@/components/dashboard/SidebarSheet';
import { Input } from '@/components/shadcn/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu';
import { Button } from '@/components/shadcn/ui/button';
import Link from 'next/link';

export default function Header() {
    return <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <SidebarSheet />
        <div className="w-full flex-1">
            <form>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                    />
                </div>
            </form>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <Link href='/api/v1/auth/signout'>
                    <DropdownMenuItem>
                        <div className='text-rose-500 font-medium'>Logout</div>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    </header>;
}