'use client';

import { PatchWebhookErrorResponse, PatchWebhookSuccessResponse } from '@/app/api/v1/webhook/[wehookId]/route';
import { PostWebhookErrorResponse, PostWebhookSuccessResponse } from '@/app/api/v1/webhook/route';
import { GetWebhooksErrorResponse, GetWebhooksSuccessResponse } from '@/app/api/v1/webhooks/route';
import WebhookCard from '@/components/dashboard/WebhookCard';
import { WebhookInfo } from '@/models/WebhookInfo';
import { useMutation, useQuery } from '@tanstack/react-query';
import { WithoutId } from 'mongodb';
import { useCallback } from 'react';

const fetchWebhooks = async () => {
    const res = await fetch('/api/v1/webhooks');
    if(!res.ok) throw res.statusText;
    const json = await res.json() as (GetWebhooksSuccessResponse | GetWebhooksErrorResponse);
    if('error' in json) throw json.error;

    return json.data;
};

const createWebhook = async (webhook: WithoutId<WebhookInfo>) => {
    const res = await fetch('/api/v1/webhook', {
        method: 'POST',
        body: JSON.stringify(webhook)
    });
    if(!res.ok) throw res.statusText;
    const json = await res.json() as (PostWebhookSuccessResponse | PostWebhookErrorResponse);
    if('error' in json) throw json.error;

    return json.data;
};

const updateWebhook = async(webhook: WebhookInfo) => {
    const id = webhook._id;
    const res = await fetch(`/api/v1/webhook/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(webhook)
    });

    if(!res.ok) throw res.statusText;
    const json = await res.json() as (PatchWebhookSuccessResponse | PatchWebhookErrorResponse);
    if('error' in json) throw json.error;

    return json.data;
};

export default function WebhooksPage() {
    const webhooksQuery = useQuery({
        queryKey: ['webhooks'],
        queryFn: fetchWebhooks
    });

    const createMutation = useMutation({ mutationFn: createWebhook });
    const updateMutation = useMutation({ mutationFn: updateWebhook });

    // const createFormCallback = useCallback((e) => {
    //     e.preventDefault();
    //     createMutation.mutate(webhook)
    // }, []);
    
    const save = useCallback(() => {}, []);

    return (
        <main className='relative h-[calc(100%-3.75rem)] max-h-[calc(100vh-3.75rem)] w-full flex flex-1 flex-col items-center gap-4 p-4 shrink overflow-y-scroll'>
            {webhooksQuery.isSuccess && webhooksQuery.data && webhooksQuery.data.map(wh => (
                <WebhookCard key={wh._id} webhook={wh} save={save} />
            ))}
        </main>
    );
}
