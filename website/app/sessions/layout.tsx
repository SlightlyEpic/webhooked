import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import Sidenav from '@/components/dashboard/Sidenav';
import { SessionProvider } from '@/components/SessionProvider';


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();

    return (
        <SessionProvider session={session}>
            <main className="mx-auto max-w-5xl text-2xl flex gap-2 bg-green-500">
                {children}
            </main>
        </SessionProvider>
    );
}
