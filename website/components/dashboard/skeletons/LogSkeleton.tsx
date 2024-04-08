import { Card, CardContent, CardFooter, CardHeader } from '@/components/shadcn/ui/card';
import { Skeleton } from '@/components/shadcn/ui/skeleton';

export function LogSkeleton() {
    return (
        <Card className='w-full'>
            <CardHeader>
                <div className='w-full h-2 flex justify-between'>
                    <Skeleton className='w-1/2 max-w-xs rounded-full' />
                    <Skeleton className='w-1/4 max-w-xs rounded-full' />
                </div>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <Skeleton className='w-3/5 h-2 max-w-md rounded-full' />
                <div className='flex gap-2'>
                    <Skeleton className='w-1/5 h-2 max-w-[10rem] rounded-full' />
                    <Skeleton className='w-3/5 h-2 max-w-[30rem] rounded-full' />
                </div>
                <Skeleton className='w-3/4 h-2 max-w-lg rounded-full' />
            </CardContent>
            <CardFooter>
                <Skeleton className='w-1/4 mt-auto max-w-[10rem] h-2 rounded-full' />
            </CardFooter>
        </Card>
    );
}
