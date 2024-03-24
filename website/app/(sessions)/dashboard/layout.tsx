import Sidenav from '@/components/dashboard/Sidenav';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="text-2xl flex gap-2 bg-zinc-800">
            <Sidenav />
            {children}
        </main>
    );
}
