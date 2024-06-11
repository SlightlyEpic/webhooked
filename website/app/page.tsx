import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import Typewrite from '@/components/home/Typewrite';
import { ChevronDown, GithubIcon } from 'lucide-react';

import './home.css';
import { Button } from '@/components/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/components/shadcn/ui/card';
import { Boxes, BoxesCore } from '@/components/aceternity/BackgroundBoxes';
import { cn } from '@/lib/utils';

export function BackgroundBoxesDemo() {
    return (
        <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

            <Boxes />
            <h1 className={cn('md:text-4xl text-xl text-white relative z-20')}>
                Tailwind is Awesome
            </h1>
            <p className="text-center mt-2 text-neutral-300 relative z-20">
                Framer motion is the best animation library ngl
            </p>
        </div>
    );
}

export default function App() {
    return <div className='w-full h-max relative flex flex-col items-center justify-center overflow-x-clip'>
        {/* <BackgroundBeams className='-z-10' /> */}
        <div className="fixed top-0 h-screen w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
        </div>

        <div className='shrink-0 grow-0 h-screen w-full relative flex flex-col items-center justify-center pointer-events-none'>
            <h1 className='font-mono text-6xl lg:text-8xl font-bold'>Webhooked</h1>
            <h3 className='font-mono font-xs lg:font-medium text-gray-400 text-center px-2'>
                <Typewrite delay={0.2} text='Enjoy seamless webhook integrations with minimal effort.' />
            </h3>

            <div className='mt-24 flex flex-col md:flex-row gap-8 justify-center items-center'>
                <Button className='flex gap-2 button-glow transition-all hover:scale-105 duration-300 pointer-events-auto'>
                    <GithubIcon size='1.5rem' />
                    <span>Continue with GitHub</span>
                </Button>
            </div>

            <ChevronDown className='pointer-events-auto cursor-pointer absolute left-1/2 top-[calc(100vh-2rem)] -translate-x-1/2 -translate-y-full animate-bounce' />
        </div>
    </div>;
}