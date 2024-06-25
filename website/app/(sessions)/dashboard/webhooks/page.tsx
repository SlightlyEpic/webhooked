'use client';

import { PatchWebhookErrorResponse, PatchWebhookSuccessResponse } from '@/app/api/v1/webhook/[webhookId]/route';
import { PostWebhookErrorResponse, PostWebhookSuccessResponse } from '@/app/api/v1/webhook/route';
import { GetWebhooksErrorResponse, GetWebhooksSuccessResponse } from '@/app/api/v1/webhooks/route';
import WebhookCard from '@/components/dashboard/WebhookCard';
import { Card } from '@/components/shadcn/ui/card';
import { MakeStringType } from '@/lib/util/types';
import { WebhookInfo } from '@/models/WebhookInfo';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/shadcn/ui/tooltip';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ListRestart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import NewWebhookInput, { type NewWebhookPartial } from '@/components/dashboard/NewWebhookInput';
import { toast } from 'sonner';

const fetchWebhooks = async () => {
    const res = await fetch('/api/v1/webhooks');
    if (!res.ok) throw res.statusText;
    const json = await res.json() as (GetWebhooksSuccessResponse | GetWebhooksErrorResponse);
    if ('error' in json) throw json.error;

    return json.data;
};

const createWebhook = async (webhook: NewWebhookPartial) => {
    const res = await fetch('/api/v1/webhook', {
        method: 'POST',
        body: JSON.stringify(webhook)
    });
    if (!res.ok) throw res.statusText;
    const json = await res.json() as (PostWebhookSuccessResponse | PostWebhookErrorResponse);
    if ('error' in json) throw json.error;

    return json.data;
};

const deleteWebhook = async (id: string) => {
    const res = await fetch(`/api/v1/webhook/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw res.statusText;
    const json = await res.json() as (PostWebhookSuccessResponse | PostWebhookErrorResponse);
    if ('error' in json) throw json.error;

    return json.data;
};

const updateWebhook = async (webhook: MakeStringType<WebhookInfo, '_id' | 'ownerId' | 'created'>) => {
    const id = webhook._id;
    const res = await fetch(`/api/v1/webhook/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(webhook)
    });

    if (!res.ok) throw res.statusText;
    const json = await res.json() as (PatchWebhookSuccessResponse | PatchWebhookErrorResponse);
    if ('error' in json) throw json.error;

    return json.data;
};

export default function WebhooksPage() {
    const queryClient = useQueryClient();
    const webhooksQuery = useQuery({
        queryKey: ['webhooks'],
        queryFn: fetchWebhooks
    });
    const [nameFilter, setNameFilter] = useState('');

    const createMutation = useMutation({
        mutationFn: (hook: Parameters<typeof createWebhook>[0]) => {
            toast('Creating webhook');
            return createWebhook(hook);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['webhooks'] });
            toast('Success');
        },
        onError: (err) => {
            toast(`Error creating webhook: ${err}`);
        }
    });
    const updateMutation = useMutation({
        mutationFn: (hook: Parameters<typeof updateWebhook>[0]) => {
            toast('Updating webhook');
            return updateWebhook(hook);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['webhooks'] });
            toast('Success');
        },
        onError: (err) => {
            toast(`Error updating webhook: ${err}`);
        }
    });
    const deleteMutation = useMutation({
        mutationFn: (id: string) => {
            toast('Deleting');
            return deleteWebhook(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['webhooks'] });
            toast('Success');
        },
        onError: (err) => {
            toast(`Error deleting webhook: ${err}`);
        }
    });

    return (
        <main className='relative h-[calc(100%-3.75rem)] max-h-[calc(100vh-3.75rem)] w-full flex flex-1 flex-col items-center gap-4 p-4 shrink overflow-y-scroll'>
            <Card className='w-full flex flex-col md:flex-row gap-2 p-4 font-bold items-start justify-between sticky top-0 z-10'>
                <Input placeholder='Name' className='flex-grow md:max-w-lg' onChange={e => setNameFilter(e.target.value)} />
                <div className='flex w-full md:w-min justify-between md:justify-end gap-2'>
                    <NewWebhookInput save={createMutation.mutate} />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className='place-self-end' variant='ghost' onClick={() => queryClient.invalidateQueries({ queryKey: ['webhooks'] })}>
                                    <ListRestart />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Refresh Webhooks
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </Card>

            {
                webhooksQuery.isSuccess && webhooksQuery.data &&
                webhooksQuery.data
                    .filter(wh => !nameFilter || (wh.name && wh.name.toLowerCase().includes(nameFilter.toLowerCase())))
                    .map(wh => (
                        <WebhookCard key={wh._id} webhook={wh} save={updateMutation.mutate} deleteCb={deleteMutation.mutate} />
                    ))
            }
        </main>
    );
}
