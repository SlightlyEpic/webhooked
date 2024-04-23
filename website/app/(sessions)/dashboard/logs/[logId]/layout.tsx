import { Card, CardContent, CardHeader } from '@/components/shadcn/ui/card';

type PageProps = {
    params: {
        logId: string
    }
}

export default function OneLogLayout({ children, params }: Readonly<{ children: React.ReactNode } & PageProps>) {
    return (
        <div className='p-4 flex flex-col'>
            <Card className='w-full'>
                <CardHeader className='flex-row gap-2'><span className='font-bold'>Log Id:</span> {params.logId}</CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    );
}