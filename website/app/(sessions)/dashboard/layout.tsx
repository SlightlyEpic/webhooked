import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative grid min-h-screen h-full w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] scroll-auto">
            <Sidebar />
            <div className="flex flex-col grow">
                <Header />
                {children}
            </div>
        </div>
    );
}
