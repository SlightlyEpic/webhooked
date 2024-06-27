import { GetLogsSuccessResponse } from '@/app/api/logs/route';
import { LogCard } from '@/components/dashboard/LogCard';
import { Button } from '@/components/shadcn/ui/button';
import { Card } from '@/components/shadcn/ui/card';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { Fragment } from 'react';

type LogListProps = {
    query: UseInfiniteQueryResult<InfiniteData<GetLogsSuccessResponse, unknown>, Error>
};

export function LogList({ query }: LogListProps) {
    const data = query.data!;

    return (
        <>
            {data.pages.map(page => <Fragment key={page.page}>
                {page.data.map(log => <LogCard key={log._id} log={log} />)}
            </Fragment>)}

            {query.hasNextPage && <Button disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
                {
                    !query.isFetchingNextPage
                        ? 'Load More'
                        : <>
                            <span className='animate-bounce'>○</span>
                            <span className='animate-bounce animation-delay-1/6'>○</span>
                            <span className='animate-bounce animation-delay-2/6'>○</span>
                        </>
                }
            </Button>}
            {!query.hasNextPage && <Button disabled>All done!</Button>}
        </>
    );
}
