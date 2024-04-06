import { Button } from '@/components/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/components/shadcn/ui/card';
import { getLogPageByName } from '@/controllers/getLogPageByName';
import { getServerSessionProfile } from '@/lib/nextauth/getSessionProfile';
import { jsonToTruncString } from '@/lib/string/prettyJson';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from '@/components/shadcn/ui/context-menu';
import Link from 'next/link';

export async function RecentLogs() {
    const [session, profile] = await getServerSessionProfile();
    if(!session) return <></>;
    if(!profile) return <></>;

    const recentLogs = await getLogPageByName(profile.login);

    return (
        <>
            {recentLogs.slice(0, 5).map(log => (
                <ContextMenu key={log._id.getTime()}>
                    <ContextMenuTrigger>
                        <Card className='font-mono'>
                            <CardHeader>
                                <div className='w-full flex flex-col @lg:flex-row items-start @lg:items-center justify-between'>
                                    <div className='flex gap-2 font-bold'>
                                        /webhooks/{log.webhookId.toHexString()}
                                    </div>
                                    <Button className='m-0 p-0 h-4' variant='link'>
                                        <Link href={`/dashboard/logs/${log._id.getTime()}`}>Open in log viewer</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex gap-2 items-center'>
                                        <div className='font-bold'>Time:</div>
                                        <div>{log._id.toUTCString()}</div>
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
