'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/shadcn/ui/button';
import { Calendar } from '@/components/shadcn/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/ui/popover';
import { type useState } from 'react';

export type DatePickerProps = {
    text?: string,
    date: Date | undefined,
    setDate: ReturnType<typeof useState<Date>>[1],
};

export const DatePicker: React.FC<DatePickerProps> = ({ text, date, setDate }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-full xl:w-64 justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    {text && <div className='mr-2 text-foreground'>{text}</div>}
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};
