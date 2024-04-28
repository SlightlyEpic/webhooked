'use client';

import { useQuery } from '@tanstack/react-query';
import { type GetWebhooksErrorResponse, type GetWebhooksSuccessResponse } from '@/app/api/v1/webhooks/route';
import { Card, CardDescription, CardTitle } from '@/components/shadcn/ui/card';
import Link from 'next/link';
import { Button } from '@/components/shadcn/ui/button';
import { Badge } from '@/components/shadcn/ui/badge';
import { LogSkeleton } from '@/components/dashboard/skeletons/LogSkeleton';

const fetchWebhooks = async () => {
    const res = await fetch('/api/v1/webhooks');
    if (!res.ok) throw res.statusText;
    const json = await res.json() as (GetWebhooksSuccessResponse | GetWebhooksErrorResponse);
    if ('error' in json) throw json.error;

    return json.data;
};

export default function YourWebhooks() {
    const webhooksQuery = useQuery({
        queryKey: ['webhooks'],
        queryFn: fetchWebhooks
    });

    if(webhooksQuery.isLoading) {
        return (
            <div className='overflow-clip flex flex-col gap-4 w-full h-full'>
                <LogSkeleton />
                <LogSkeleton />
            </div>
        );
    }

    return (
        <div className='overflow-clip flex flex-col gap-4 w-full shrink flex-wrap'>
            {
                webhooksQuery.isSuccess && webhooksQuery.data &&
                webhooksQuery.data
                    .map(wh => (
                        <Card key={wh._id} className='w-full flex flex-col p-4 gap-4'>
                            <CardTitle className='flex flex-col gap-4 @lg:flex-row items-start @lg:items-center'>
                                <Link href={`/dashboard/webhooks/${wh._id}`} className='hover:underline font-mono'>
                                    {wh.name}
                                </Link>
                                <div className='flex gap-4 @lg:ml-auto h-min items-center'>
                                    <Button className='p-0' variant='link'>
                                        <Link href={`/dashboard/logs/${wh._id}`}>
                                            View log
                                        </Link>
                                    </Button>
                                    <Badge variant={wh.archived ? 'outline' : 'default'} className='w-16 justify-center'>
                                        {wh.archived ? 'Inactive' : 'Active'}
                                    </Badge>
                                </div>
                            </CardTitle>
                            <CardDescription>
                                Created: {wh.created}
                            </CardDescription>
                        </Card>
                    ))
            }
        </div>
    );
}
