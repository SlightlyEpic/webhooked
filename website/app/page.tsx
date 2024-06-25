import Typewrite from '@/components/home/Typewrite';
import { ChevronDown, GithubIcon } from 'lucide-react';

import './home.css';
import { Button } from '@/components/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/components/shadcn/ui/card';
import { Boxes } from '@/components/aceternity/BackgroundBoxes';
import Link from 'next/link';

export default function App() {
    return <div className='w-full h-max relative flex flex-col items-center justify-center overflow-x-clip'>
        <div className="absolute top-0 h-screen w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
        </div>

        <div className='shrink-0 grow-0 h-screen w-full relative flex flex-col items-center justify-center pointer-events-none'>
            <h1 className='font-mono text-6xl lg:text-8xl font-bold'>Webhooked</h1>
            <h3 className='font-mono font-xs lg:font-medium text-gray-400 text-center px-2'>
                <Typewrite delay={0.2} text='Enjoy seamless webhook integrations with minimal effort.' />
            </h3>

            <div className='mt-24 flex flex-col md:flex-row gap-8 justify-center items-center'>
                <Link href='/login'>
                    <Button className='flex gap-2 button-glow transition-all hover:scale-105 duration-300 pointer-events-auto'>
                        <GithubIcon size='1.5rem' />
                        <span>Continue with GitHub</span>
                    </Button>
                </Link>
            </div>

            {/* <div className='pointer-events-auto cursor-pointer absolute left-1/2 top-[calc(100vh-1rem)] -translate-x-1/2 -translate-y-full'>
                <ChevronDown className='animate-bounce' />
            </div> */}
        </div>

        {/* <div className='w-full grow flex flex-col gap-8 p-8 text-white z-20 items-center justify-center'>
            <h4 className='font-extrabold text-2xl text-primary'>Overview</h4>
            <div className='grid grid-cols-2 gap-24'>
                <div className='max-w-lg leading-7'>
                    Recieving and managing webhooks can sometimes be difficult. 
                    Maybe you don&apos;t have a domain to recieve webhooks at.
                    Maybe you just want to test locally. 
                    Maybe you don&apos;t want to miss any data if your application goes down.
                    Maybe you just want a <b>simple solution</b> to all of these problems.
                </div>
                <div className='max-w-lg leading-7'>
                    Our service enables your applications to recieve data the way they want to recieve it.
                    Set up a websocket connection in seconds and have data being sent your way!
                </div>
            </div>
        </div> */}
    </div>;
}