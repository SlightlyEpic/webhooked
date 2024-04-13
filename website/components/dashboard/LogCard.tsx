import { jsonToTruncString } from '@/lib/string/prettyJson';
import { Card, CardContent, CardHeader } from '@/components/shadcn/ui/card';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from '@/components/shadcn/ui/context-menu';
import { WebhookLogEntry } from '@/models/WebhookLogEntry';
import { MakeStringType } from '@/lib/util/types';
import { useMemo } from 'react';

export type LogCardProps = {
    log: MakeStringType<WebhookLogEntry, '_id' | 'webhookId' | 'ownerId'>
}

export function LogCard({ log }: LogCardProps) {
    const date = useMemo(() => new Date(log._id), [log._id]);

    return (
        <ContextMenu key={log._id}>
            <ContextMenuTrigger className='w-full'>
                <Card className='font-mono'>
                    <CardHeader>
                        <div className='w-full flex flex-col @lg:flex-row items-start @lg:items-center justify-between'>
                            <div className='flex gap-2 font-bold'>
                                /webhooks/{log.webhookId}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-2 items-center'>
                                <div className='font-bold'>Time:</div>
                                <div>{date.toUTCString()}</div>
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
    );
}