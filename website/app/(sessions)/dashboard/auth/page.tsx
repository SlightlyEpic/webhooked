'use client';

import { GetUserErrorResponse, GetUserSuccessResponse } from '@/app/api/v1/user/route';
import { LogSkeleton } from '@/components/dashboard/skeletons/LogSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/ui/card';
import { Input } from '@/components/shadcn/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const fetchUser = async () => {
    const res = await fetch('/api/v1/user');
    if (!res.ok) throw res.statusText;
    const json = await res.json() as (GetUserSuccessResponse | GetUserErrorResponse);
    if ('error' in json) throw json.error;

    return json.data;
};

export default function AuthenticationInfoPage() {
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser
    });
    const [isViewing, setIsViewing] = useState(false);

    const tryCopyId = useCallback(async () => {
        await navigator.clipboard.writeText(userQuery.data!._id);
        toast('Copied!');
    }, [userQuery.data]);

    const tryCopySecret = useCallback(async () => {
        await navigator.clipboard.writeText(userQuery.data!.apiKey);
        toast('Copied!');
    }, [userQuery.data]);

    return (
        <main className='relative h-[calc(100%-3.75rem)] max-h-[calc(100vh-3.75rem)] w-full flex flex-1 flex-col items-center gap-4 p-4 shrink overflow-y-scroll'>
            {userQuery.isLoading || !userQuery.isSuccess
                ? <LogSkeleton />
                : (
                    <Card className='w-full'>
                        <CardHeader>
                            <CardTitle>Your info</CardTitle>
                        </CardHeader>
                        <CardContent className='font-mono grid grid-cols-2 gap-2 items-center'>
                            <div className='font-bold'>API Client Id:</div>
                            <div className='font-mono flex gap-4 items-center'>
                                <Input className='w-96' value={userQuery.data!._id} readOnly />
                                <Copy className='h-6 w-6 text-muted-foreground hover:text-foreground' role='button' onClick={tryCopyId} />
                            </div>
                            <div className='font-bold'>API Secret:</div>
                            <div className='font-mono flex gap-4 items-center'>
                                <Input className='w-96' value={userQuery.data!.apiKey} readOnly type={isViewing ? 'text' : 'password'} />
                                {isViewing && <EyeOff onClick={() => setIsViewing(false)} className='h-6 w-6 text-muted-foreground hover:text-foreground' />}
                                {!isViewing && <Eye onClick={() => setIsViewing(true)} className='h-6 w-6 text-muted-foreground hover:text-foreground' />}
                                <Copy className='h-6 w-6 text-muted-foreground hover:text-foreground' role='button' onClick={tryCopySecret} />
                            </div>

                            <div className='font-bold'>Registered:</div>
                            <Input className='w-96' value={userQuery.data!.registeredAt} readOnly />
                            
                            <div className='font-bold'>Last sign in:</div>
                            <Input className='w-96' value={userQuery.data!.lastSignIn} readOnly />
                        </CardContent>
                    </Card>
                )
            }
        </main>
    );
}
