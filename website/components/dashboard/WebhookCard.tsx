'use client';

import { WebhookInfo } from '@/models/WebhookInfo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../shadcn/ui/card';
import { MakeStringType } from '@/lib/util/types';
import { useCallback, useRef, useState } from 'react';
import { Input } from '../shadcn/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '../shadcn/ui/alert-dialog';
import { Button } from '../shadcn/ui/button';
import { SquarePlus, Trash2 } from 'lucide-react';

type CardProps = {
    webhook: MakeStringType<WebhookInfo, '_id' | 'owner'>
    save: (newWebhook: CardProps['webhook']) => unknown
}

export default function WebhookCard({ webhook, save }: CardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editWebhook, setEditWebhook] = useState({...webhook});
    const [newUrl, setNewUrl] = useState('');

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
    }, []);

    const removeUrl = useCallback((url: string) => {
        setEditWebhook(hook => {
            hook.destinationUrls = hook.destinationUrls.filter(v => v !== url);
            return { ...hook };
        });
    }, []);

    return (
        <Card className='w-full font-mono'>
            <CardHeader>
                <CardTitle>{webhook.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div><span className='font-bold'>Id:</span> {webhook._id}</div>
                {/* <div>Created: {webhook.created.toISOString()}</div> */}
                <div className='flex gap-2'>
                    <span className='font-bold'>Forwarded to:</span>
                    <div className='flex flex-col'>
                        {webhook.destinationUrls.map((url, i) => (
                            <div key={i}>{i + 1}. {url}</div>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button>Edit</Button>
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
                                        <Button variant='destructive' onClick={() => removeUrl(url)}><Trash2 className='w-6 h-6' /></Button>
                                    </div>
                                ))}
                                <div className='flex gap-2'>
                                    <Input onChange={e => setNewUrl(e.target.value)} defaultValue={newUrl} />
                                    <Button onClick={() => addUrl(newUrl)} variant='secondary'><SquarePlus className='w-6 h-6' /></Button>
                                </div>
                            </div>
                        </div>
                        <AlertDialogFooter className='mt-4'>
                            <AlertDialogCancel className='w-1/2'>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='w-1/2'>Save</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
