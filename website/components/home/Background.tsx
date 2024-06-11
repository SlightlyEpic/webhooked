import { forwardRef, useEffect, useRef } from 'react';

export default function BackgroundBlobs() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const resizeCanvas = () => {
            if(!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            
        };

        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvasRef.current!);
    }, []);

    return <canvas 
        className='absolute h-full w-full'
        ref={canvasRef}
    />;
}
