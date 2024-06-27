import { getServerSession } from 'next-auth';
import { SessionProvider } from '@/components/SessionProvider';
import StoreProvider from '@/components/StoreProvider';

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode }>) {
    const session = await getServerSession();

    return (
        <SessionProvider session={session}>
            <StoreProvider>
                {children}
            </StoreProvider>
        </SessionProvider>
    );
}
