'use client';

import AuthButton from '@/components/AuthButton';

export default function Sidenav() {
    return (
        <div className="bg-slate-500 min-h-screen flex flex-col justify-between">
            <AuthButton />
        </div>
    );
}