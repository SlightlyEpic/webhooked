'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import { Toaster } from '@/components/shadcn/ui/sonner';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryProvider>
            <div className="relative grid min-h-screen w-full h-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] scroll-auto">
                <Sidebar />
                <div className="flex flex-col grow-0 h-screen max-h-screen">
                    <Header />
                    {children}
                    <Toaster />
                </div>
            </div>
        </ReactQueryProvider>
    );
}
