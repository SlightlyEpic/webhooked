import { ObjectId } from 'mongodb';
import { z } from 'zod';

export type WebhookInfo = {
    _id: ObjectId
    name: string
    destinationUrls: string[]
    log: Date[]
    owner: ObjectId
    active: boolean
    archived: boolean
    created: Date
};

export const webhookInfoSchema = z.object({
    _id: z.optional(z.string()),
    name: z.string().min(1, 'name cannot be empty'),
    destinationUrls: z.array(z.string()),
    log: z.array(z.date()),
    owner: z.string(),
    active: z.boolean(),
    archived: z.boolean(),
    created: z.date()
});
