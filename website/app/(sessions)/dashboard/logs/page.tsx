'use client';

import { DatePicker } from '@/components/dashboard/DatePicker';
import { LogSkeleton } from '@/components/dashboard/skeletons/LogSkeleton';
import { Alert, AlertDescription } from '@/components/shadcn/ui/alert';
import { Button } from '@/components/shadcn/ui/button';
import { Card } from '@/components/shadcn/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/ui/select';
import { Tooltip } from '@/components/shadcn/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { ListRestart } from 'lucide-react';
import { Suspense, useState } from 'react';

export default function LogsPage() {
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [loading, setLoading] = useState(true);

    return (
        <main className='relative h-[calc(100%-3.75rem)] max-h-[calc(100vh-3.75rem)] w-full flex flex-1 flex-col items-center gap-4 p-4 shrink overflow-y-scroll'>
            <Card className='w-full flex flex-col lg:flex-row gap-2 p-4 font-bold items-center sticky top-0 z-10'>
                <DatePicker text='From: ' date={fromDate} setDate={setFromDate} />
                <DatePicker text='To:' date={toDate} setDate={setToDate} />

                <Select defaultValue='All webhooks'>
                    <SelectTrigger className='w-96'>
                        <SelectValue placeholder='All webhooks' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='All webhooks'>All webhooks</SelectItem>
                            {/* // TODO: Populate from redux state */}
                            <SelectItem value='abcd'>abcd</SelectItem>
                            <SelectItem value='efgh'>efgh</SelectItem>
                            <SelectItem value='hijk'>hijk</SelectItem>
                            <SelectItem value='lmno'>lmno</SelectItem>
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
                            <Alert className='p-2'>
                                <AlertDescription>Refresh logs</AlertDescription>
                            </Alert>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </Card>

            {loading && new Array(4).fill(0).map((v, i) => <LogSkeleton key={i} />)}
            {!loading && null}
        </main>
    );
}

