import ProfileBar from '@/components/dashboard/ProfileBar';
import { LogSkeleton } from '@/components/dashboard/skeletons/LogSkeleton';
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
        // 3.75rem is header height + something, horrible
        <main className='h-full lg:h-[calc(100%-3.75rem)] max-h-[calc(100vh-3.75rem)] w-full flex flex-1 flex-col items-center gap-4 p-4 shrink'>
            <div className='hidden lg:block relative w-full h-48 rounded-md overflow-clip shrink-0'>
                <Image priority src='/bg/1.jpeg' alt='background' className='w-full object-cover' fill sizes='100%' />
            </div>
            <div className='w-full lg:px-4 shrink-0'>
                <ProfileBar />
            </div>
            <ResizablePanelGroup direction='horizontal' className='gap-4' style={{ overflow: 'clip', height: '' }}>
                <ResizablePanel className='w-full hidden lg:flex @container overflow-auto' defaultSize={50}>
                    <div className='flex @3xs:hidden items-center justify-center h-full w-full'>
                        <Ellipsis className='block @3xs:hidden h-16 w-16 text-muted self-center justify-self-center' />
                    </div>

                    <div className='hidden @3xs:flex gap-4 flex-col w-full h-full flex-wrap shrink'>
                        <Card className='w-full p-4'>
                            <CardTitle className='flex gap-4 items-center'>
                                <Clock2 className='h-6 w-6' />
                                Recent logs
                            </CardTitle>
                        </Card>

                        {[0, 1, 2, 3, 4, 5].map(v => <LogSkeleton key={v} />)}
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle className='hidden lg:flex' />
                <ResizablePanel defaultSize={50} style={{ overflow: 'visible' }} className='@container h-full'>
                    <div className='flex @3xs:hidden items-center justify-center h-full'>
                        <Ellipsis className='h-16 w-16 text-muted' />
                    </div>

                    <div className='hidden @3xs:flex flex-col h-full w-full gap-4'>
                        <Card className='h-fit w-full p-4 box-border'>
                            <CardTitle className='flex gap-2 items-center'>
                                <Star className='h-6 w-6 text-yellow-400' />
                                Starred webhooks
                            </CardTitle>
                        </Card>

                        <div className='overflow-clip flex flex-col gap-4 w-full shrink flex-wrap'>
                            {sampleWebhookData.slice(0, 3).map(webhook => 
                                <Card key={webhook._id} className='w-full flex flex-col p-4 gap-4'>
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