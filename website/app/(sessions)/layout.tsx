import { getServerSession } from 'next-auth';
import { SessionProvider } from '@/components/SessionProvider';
import StoreProvider from '@/components/StoreProvider';

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode }>) {
    const session = await getServerSession();

    return (
        <SessionProvider session={session} basePath='/api/v1/auth'>
            <StoreProvider>
                {children}
            </StoreProvider>
        </SessionProvider>
    );
}
