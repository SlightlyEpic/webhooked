'use client';

import type { GetWebhooksSuccessResponse, GetWebhooksErrorResponse } from '@/app/api/v1/webhooks/route';
import { DatePicker } from '@/components/dashboard/DatePicker';
import { LogSkeleton } from '@/components/dashboard/skeletons/LogSkeleton';
import { Alert, AlertDescription } from '@/components/shadcn/ui/alert';
import { Button } from '@/components/shadcn/ui/button';
import { Card } from '@/components/shadcn/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/ui/select';
import { Tooltip } from '@/components/shadcn/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/shadcn/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { ListRestart } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function LogsPage() {
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [webhookId, setWebhookId] = useState<string>();
    const [loading, setLoading] = useState(true);

    const webhooksQuery = useQuery<GetWebhooksSuccessResponse>({
        queryKey: ['webhooks', 'all'],
        queryFn: async () => {
            const params = new URLSearchParams();
            if(fromDate) params.append('from', fromDate.getTime().toString());
            if(toDate) params.append('to', toDate.getTime().toString());
            if(webhookId) params.append('webhookId', webhookId);

            const paramsString = params.toString();

            const res = await fetch(`/api/v1/webhooks${paramsString ? '?' : ''}${paramsString}`);
            if(!res.ok) throw res.statusText;
            const json = await res.json() as (GetWebhooksSuccessResponse | GetWebhooksErrorResponse);
            if('error' in json) throw json.error;

            return json;
        },
        retry: 1,
        staleTime: 15 * 60 * 1000
    });

    const selectChangeHandler = useCallback((value: string) => {
        if(!webhooksQuery.isSuccess) return;
        if(value === 'All webhooks') setWebhookId(undefined);
        else setWebhookId(value);
    }, [webhooksQuery]);

    return (
        <main className='relative h-[calc(100%-3.75rem)] max-h-[calc(100vh-3.75rem)] w-full flex flex-1 flex-col items-center gap-4 p-4 shrink overflow-y-scroll'>
            <Card className='w-full flex flex-col xl:flex-row gap-2 p-4 font-bold items-center sticky top-0 z-10'>
                <DatePicker text='From: ' date={fromDate} setDate={setFromDate} />
                <DatePicker text='To:' date={toDate} setDate={setToDate} />

                <Select onValueChange={selectChangeHandler} defaultValue='All webhooks'>
                    <SelectTrigger className='w-full xl:max-w-96 shrink'>
                        <SelectValue placeholder='All webhooks' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {webhooksQuery.isError && <SelectItem value='All webhooks'>Error loading webhooks</SelectItem>}
                            {webhooksQuery.isLoading && <SelectItem value='All webhooks'>Loading...</SelectItem>}
                            {webhooksQuery.isSuccess && <SelectItem value='All webhooks'>All webhooks</SelectItem>}

                            {webhooksQuery.isSuccess && webhooksQuery.data.data.map(hook => (
                                <SelectItem key={hook._id} value={hook._id}>{hook._id}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className='ml-auto gap-2' variant='ghost'>
                                <ListRestart />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Refresh logs
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </Card>

            {loading && new Array(4).fill(0).map((v, i) => <LogSkeleton key={i} />)}
            {!loading && null}
        </main>
    );
}

