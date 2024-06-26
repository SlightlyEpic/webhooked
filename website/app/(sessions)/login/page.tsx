'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/shadcn/ui/card';
import { Button } from '@/components/shadcn/ui/button';
import { Github, Webhook } from 'lucide-react';
import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/shadcn/ui/separator';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/shadcn/ui/navigation-menu';

const Home: NextPage = () => {
    const { data: session } = useSession();
    if (session) {
        redirect('/dashboard');
    }

    return (
        <div className='h-screen top-0 sticky w-full bg-black flex flex-col items-center justify-between p-2'>
            <div className='w-full'>
                <NavigationMenu className='w-full grow-0 [&>*]:grow'>
                    <NavigationMenuList className='w-full justify-end'>
                        <NavigationMenuItem className='mr-auto'>
                            <Link href='/'>
                                <Webhook className='ml-2' />
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href='/guide' legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Guide</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href='/' legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <Separator className='my-2' />
            </div>

            <div className='w-full h-full max-w-lg max-h-72 p-px rounded-md'>
                <Card className='w-full h-full rounded-md flex flex-col justify-between'>
                    <CardHeader>
                        <CardTitle>Login to Webhooked</CardTitle>
                        <CardDescription>Awesome webhook features are waiting!</CardDescription>
                    </CardHeader>
                    <CardFooter className='flex-col gap-2'>
                        <Button className="w-full gap-2" onClick={() => signIn('github')}>
                            <Github /> Sign in with <b>GitHub</b>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Element to place card on center */}
            <div></div>
        </div>
    );
};

export default Home;