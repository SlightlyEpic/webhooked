'use client';

import { cn } from '@/lib/utils';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

export interface TypewriteProps {
    text: string
    delay?: number          // initial delay
    cps?: number            // characters per second
    randomness?: number     // noise added to cps
    className?: string
};

function whitespace(length: number): string {
    return new Array(length).fill(' ').join('');
}

export default function Typewrite({ text, className, delay, cps, randomness }: TypewriteProps) {
    if(!delay) delay = 0;
    if(!cps) cps = 15;
    if(!randomness) randomness = 0;

    const [nextCharIndex, setNextCharIndex] = useState(0);
    const textRef = useRef<HTMLDivElement>(null);
    const nextUpdateId = useRef<ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>>();

    const addChar = useCallback(() => {
        if(nextCharIndex === text.length) {
            nextUpdateId.current = undefined;
            return;
        }

        setNextCharIndex(idx => idx + 1);
        nextUpdateId.current = setTimeout(addChar, 1000 / cps + 50 * (Math.random() - 0.5) * randomness);
    }, []);
    
    useEffect(() => {
        if(nextUpdateId.current) clearTimeout(nextUpdateId.current);
        nextUpdateId.current = setTimeout(addChar, delay * 1000);

        return () => {
            clearTimeout(nextUpdateId.current);
            nextUpdateId.current = undefined;
        };
    }, []);

    return <div ref={textRef} className={cn(className, 'whitespace-pre-wrap')}>
        <span>{ text.substring(0, nextCharIndex) }</span>
        <span className='invisible'>{ text.substring(nextCharIndex) }</span>
    </div>;
}
