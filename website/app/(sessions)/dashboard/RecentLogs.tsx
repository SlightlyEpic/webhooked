'use client';

import { Button } from '@/components/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/components/shadcn/ui/card';
import { jsonToTruncString } from '@/lib/string/prettyJson';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from '@/components/shadcn/ui/context-menu';
import Link from 'next/link';
import { GetLogsErrorResponse, GetLogsSuccessResponse } from '@/app/api/logs/route';
import { useQuery } from '@tanstack/react-query';
import { LogSkeleton } from '@/components/dashboard/skeletons/LogSkeleton';

const fetchLogs = async () => {
    const res = await fetch('/api/logs');
    if (!res.ok) throw res.statusText;
    const json = await res.json() as (GetLogsSuccessResponse | GetLogsErrorResponse);
    if ('error' in json) throw json.error;

    return json.data;
};

export function RecentLogs() {
    const logsQuery = useQuery({
        queryKey: ['logs'],
        queryFn: fetchLogs
    });


    if (logsQuery.isLoading) {
        return (
            <>
                {[0, 1, 2, 3, 4, 5].map(v => <LogSkeleton key={v} />)}
            </>
        );
    }

    return (
        <>
            {
                logsQuery.isSuccess && logsQuery.data && logsQuery.data &&
                logsQuery.data.slice(0, 5).map(log => (
                    <ContextMenu key={log._id}>
                        <ContextMenuTrigger>
                            <Card className='font-mono'>
                                <CardHeader>
                                    <div className='w-full flex flex-col @lg:flex-row items-start @lg:items-center justify-between'>
                                        <div className='flex gap-2 font-bold'>
                                            /webhooks/{log.webhookId}
                                        </div>
                                        <Button className='m-0 p-0 h-4' variant='link'>
                                            <Link href={`/dashboard/logs/${log._id}`}>Open in log viewer</Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex gap-2 items-center'>
                                            <div className='font-bold'>Time:</div>
                                            <div>{log._id}</div>
                                        </div>
                                        <div className='flex gap-2 items-center'>
                                            <div className='font-bold'>Forwarded to:</div>
                                            <div>{`${log.successfulForwards} URLs`}</div>
                                        </div>
                                        <div className='flex gap-2 items-center'>
                                            <div className='font-bold'>Data:</div>
                                            <div className='flex gap-2'>{jsonToTruncString(log.data as { [key: string]: unknown })}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ContextMenuTrigger>

                        <ContextMenuContent className='w-64'>
                            <ContextMenuItem>
                                Copy Timestamp
                            </ContextMenuItem>
                            <ContextMenuItem>
                                Copy Time String
                            </ContextMenuItem>
                            <ContextMenuItem>
                                Copy Data
                                <ContextMenuShortcut>⌘ C</ContextMenuShortcut>
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
        </>
    );
}
