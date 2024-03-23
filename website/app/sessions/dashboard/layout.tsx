import Sidenav from '@/components/dashboard/Sidenav';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="mx-auto max-w-5xl text-2xl flex gap-2 bg-green-500">
            <Sidenav />
            {children}
        </main>
    );
}
