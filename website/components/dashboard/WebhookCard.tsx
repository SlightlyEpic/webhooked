'use client';

import { WebhookInfo } from '@/models/WebhookInfo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../shadcn/ui/card';
import { MakeStringType } from '@/lib/util/types';
import { useCallback, useRef, useState } from 'react';
import { Input } from '../shadcn/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '../shadcn/ui/alert-dialog';
import { Button } from '../shadcn/ui/button';
import { SquarePlus, Trash2 } from 'lucide-react';
import { Badge } from '../shadcn/ui/badge';
import Link from 'next/link';

type CardProps = {
    webhook: MakeStringType<WebhookInfo, '_id' | 'ownerId' | 'created'>
    save: (newWebhook: CardProps['webhook']) => unknown
    deleteCb: (id: string) => unknown
}

export default function WebhookCard({ webhook, save, deleteCb }: CardProps) {
    const [editWebhook, setEditWebhook] = useState({ ...webhook });
    const [newUrl, setNewUrl] = useState('');
    const newUrlRef = useRef<HTMLInputElement>(null);

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
        <Card className='w-full font-mono'>
            <CardHeader>
                <CardTitle className='flex justify-between flex-row items-center'>
                    <div>{webhook.name}</div>
                    <div className='flex items-center gap-4'>
                        <Link href={`/logs/${webhook._id}`}>
                            <Button className='p-0' variant='link'>View logs</Button>
                        </Link>
                        <Badge variant={webhook.active ? 'default' : 'outline'}>{webhook.active ? 'Active' : 'Inactive'}</Badge>
                        <Button className='ml-4 w-min' variant='destructive' onClick={() => deleteCb(webhook._id)}>
                            <Trash2 />
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div><span className='font-bold'>Id:</span> {webhook._id}</div>
                <div><span className='font-bold'>Created:</span> {webhook.created}</div>
                <div className='flex flex-col lg:flex-row lg:gap-2'>
                    <span className='font-bold'>Forwarded to:</span>
                    <ol className='list-decimal ml-8'>
                        {webhook.destinationUrls.map((url, i) => (
                            <li key={i}>{url}</li>
                        ))}
                    </ol>

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
                            <AlertDialogAction className='w-1/2' onClick={() => save(editWebhook)}>Save</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
