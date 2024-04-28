'use client';

import { type newWebhookInfoSchema } from '@/models/WebhookInfo';
import { MakeStringType } from '@/lib/util/types';
import { useCallback, useRef, useState } from 'react';
import { Input } from '../shadcn/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '../shadcn/ui/alert-dialog';
import { Button } from '../shadcn/ui/button';
import { SquarePlus, Trash2 } from 'lucide-react';
import { z } from 'zod';

export type NewWebhookPartial = z.infer<typeof newWebhookInfoSchema>;
type CardProps = {
    save: (newWebhook: NewWebhookPartial) => unknown
}

export default function NewWebhookInput({ save }: CardProps) {
    const [editWebhook, setEditWebhook] = useState<Parameters<typeof save>[0]>({
        name: '',
        destinationUrls: [],
    });
    const [newUrl, setNewUrl] = useState('');
    const newUrlRef = useRef<HTMLInputElement>(null);

    const saveHelper = useCallback(() => {
        save(editWebhook);
        setEditWebhook({ name: '', destinationUrls: [] });
    }, [save, editWebhook]);

    const setName = useCallback((name: string) => {
        setEditWebhook(hook => {
            hook.name = name;
            return { ...hook };
        });
    }, []);

    const setUrl = useCallback((url: string, idx: number) => {
        setEditWebhook(hook => {
            hook.destinationUrls[idx] = url;
            return { ...hook };
        });
    }, []);

    const addUrl = useCallback((url: string) => {
        setEditWebhook(hook => {
            if (hook.destinationUrls.includes(url)) return hook;
            hook.destinationUrls.push(url);
            return { ...hook };
        });
        if (newUrlRef.current) newUrlRef.current.value = '';
    }, []);

    const removeUrl = useCallback((idx: number) => {
        setEditWebhook(hook => {
            hook.destinationUrls = hook.destinationUrls.filter((v, i) => i !== idx);
            return { ...hook };
        });
    }, []);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='gap-2'>New webhook</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <div className='flex flex-col gap-2'>
                    <div className='font-bold font-mono'>Webhook name</div>
                    <Input onChange={e => setName(e.target.value)} defaultValue={editWebhook.name} />

                    <div className='font-bold font-mono mt-2'>Forwarded to</div>
                    <div className='flex flex-col gap-2'>
                        {editWebhook.destinationUrls.map((url, i) => (
                            <div className='flex gap-2 w-full' key={i}>
                                <Input onChange={e => setUrl(e.target.value, i)} defaultValue={url} />
                                <Button variant='destructive' onClick={() => removeUrl(i)}><Trash2 className='w-6 h-6' /></Button>
                            </div>
                        ))}
                        <div className='flex gap-2'>
                            <Input onChange={e => setNewUrl(e.target.value)} defaultValue={newUrl} ref={newUrlRef} />
                            <Button onClick={() => addUrl(newUrl)} variant='secondary'><SquarePlus className='w-6 h-6' /></Button>
                        </div>
                    </div>
                </div>
                <AlertDialogFooter className='mt-4'>
                    <AlertDialogCancel className='w-1/2'>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='w-1/2' onClick={saveHelper}>Save</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
