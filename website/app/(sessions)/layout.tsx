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
            {children}
        </SessionProvider>
    );
}
