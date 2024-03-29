import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/ui/avatar';
import { Badge } from '@/components/shadcn/ui/badge';
import { Button } from '@/components/shadcn/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/shadcn/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/shadcn/ui/resizable';
import { Separator } from '@/components/shadcn/ui/separator';
import { Clock2, Ellipsis, Github, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const sampleWebhookData = [
    {
        _id: '6606edac318a0d68659bfef5',
        destinationUrls: ['https://example.com/webhook'],
        log: ['1', '2', '3'],
        owner: '1',
        archived: false,
        createdOn: '2021-10-10T00:00:00.000Z'
    },
    {
        _id: '6606edb56c85e8d5655e6496',
        destinationUrls: ['https://example.com/webhook'],
        log: ['4', '5', '6'],
        owner: '1',
        archived: false,
        createdOn: '2021-10-10T00:00:00.000Z'
    },
    {
        _id: '6606edbb76eeff2e120df87c',
        destinationUrls: ['https://example.com/webhook'],
        log: ['7', '8', '9'],
        owner: '1',
        archived: true,
        createdOn: '2021-10-10T00:00:00.000Z'
    }
];

export default function Page() {
    return (
        <main className='h-full w-full flex flex-1 flex-col items-center gap-4 p-4'>
            <div className='hidden lg:block relative w-full h-64 rounded-md overflow-clip'>
                <Image priority src='/bg/1.jpeg' alt='background' className='w-full object-cover' fill sizes='100%' />
            </div>
            <div className='w-full lg:px-4'>
                <div className='flex gap-4 items-center w-full backdrop-blur-lg border-muted border bg-background/70 h-24 rounded-md p-4 lg:-mt-16 z-10'>
                    <Avatar className='h-16 w-16'>
                        <AvatarImage src='https://avatars.githubusercontent.com/u/42976178?v=4' alt='avatar' />
                        <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <div className='text-2xl font-medium font-mono'>Display Name</div>
                        <div className='font-medium font-mono text-foreground/50'>Username</div>
                    </div>
                    <div className='ml-auto hidden sm:flex gap-4'>
                        <Badge className='items-center'>5 Active</Badge>
                        <Badge variant='outline'>1 Inactive</Badge>
                    </div>
                </div>
            </div>
            <ResizablePanelGroup direction='horizontal' className='gap-4' style={{ overflow: 'visible' }}>
                <ResizablePanel className='hidden lg:flex @container' defaultSize={50}>
                    <div className='flex @3xs:hidden items-center justify-center h-full'>
                        <Ellipsis className='block @3xs:hidden h-16 w-16 text-muted self-center justify-self-center' />
                    </div>

                    <div className='hidden @3xs:flex flex-col h-full w-full'>
                        <Card className='h-fit w-full p-4'>
                            <CardTitle className='flex gap-4 items-center'>
                                <Clock2 className='h-6 w-6' />
                                Recent logs
                            </CardTitle>
                        </Card>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle className='hidden lg:flex' />
                <ResizablePanel defaultSize={50} style={{ overflow: 'visible' }} className='@container'>
                    <div className='flex @3xs:hidden items-center justify-center h-full'>
                        <Ellipsis className='h-16 w-16 text-muted' />
                    </div>

                    <div className='hidden @3xs:flex flex-col h-full gap-4'>
                        <Card className='h-fit w-full p-4 box-border'>
                            <CardTitle className='flex gap-2 items-center'>
                                <Star className='h-6 w-6 text-yellow-400' />
                                Starred webhooks
                            </CardTitle>
                        </Card>

                        <div className='overflow-clip flex flex-col gap-4 shrink @sm:[&>*:nth-child(2)]:flex @xl:[&>*:nth-child(3)]:flex'>
                            {sampleWebhookData.slice(0, 3).map(webhook => 
                                <Card key={webhook._id} className='hidden first:flex flex-col p-4 gap-4'>
                                    <CardTitle className='flex flex-col gap-4 @lg:flex-row items-start @lg:items-center'>
                                        <Link href={`/dashboard/webhooks/${webhook._id}`} className='hover:underline font-mono'>
                                            {webhook._id}
                                        </Link>
                                        <div className='flex gap-4 @lg:ml-auto h-min items-center'>
                                            <Button className='p-0' variant='link'>
                                                <Link href={`/dashboard/logs/${webhook._id}`}>
                                                    View log
                                                </Link>
                                            </Button>
                                            <Badge variant={webhook.archived ? 'outline' : 'default'} className='w-16 justify-center'>
                                                {webhook.archived ? 'Inactive' : 'Active'}
                                            </Badge>
                                        </div>
                                    </CardTitle>
                                    <CardDescription>
                                        Created: {webhook.createdOn}
                                    </CardDescription>
                                </Card>
                            )}
                        </div>

                        <Separator className='mt-auto' />
                        <div className='w-full grid grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-4 gap-4'>
                            <Button> 
                                <Link href='/dashboard/webhooks'>
                                    New webhook
                                </Link>
                            </Button>
                            <Button>
                                <Link href='/dashboard/logs'>
                                    Browse logs
                                </Link>
                            </Button>
                            <Button>
                                <Link href='/dashboard/auth'>
                                    Authentication
                                </Link>
                            </Button>
                            <Button variant='link' className='border border-muted hover:border-primary transition-none'>
                                <Link href='https://github.com/SlightlyEpic/webhooked' className='flex gap-2 items-center'>
                                    <Github className='h-4 w-4' /> View source
                                </Link>
                            </Button>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}