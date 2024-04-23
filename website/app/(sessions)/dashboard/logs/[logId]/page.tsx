'use client';

import { GetLogErrorResponse, GetLogSuccessResponse } from '@/app/api/v1/log/route';
import { LogCard } from '@/components/dashboard/LogCard';
import { LogSkeleton } from '@/components/dashboard/skeletons/LogSkeleton';
import { useQuery } from '@tanstack/react-query';

type PageProps = {
    params: {
        logId: string
    }
}

export default function OneLogPage({ params }: PageProps) {
    const logQuery = useQuery({
        queryKey: ['log', params.logId],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            searchParams.append('logId', params.logId);

            const res = await fetch('/api/v1/log?' + searchParams);
            if(!res.ok) throw res.statusText;
            const json = await res.json() as (GetLogSuccessResponse | GetLogErrorResponse);

            if('error' in json) throw json.error;
            return json;
        }
    });

    if(logQuery.isFetching) {
        return <LogSkeleton />;
    }

    return <></>;
}
