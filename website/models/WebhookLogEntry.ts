import { ObjectId } from 'mongodb';
import { z } from 'zod';

export type WebhookLogEntry = {
    _id: Date
    webhookId: ObjectId
    senderIp: string
    ownerId: ObjectId
    data: unknown
    successfulForwards: number
};

export const webhookLogEntrySchema = z.object({
    _id: z.optional(z.string()),
    webhookId: z.string(),
    senderIp: z.string(),
    data: z.any(),
    successfulForwards: z.number()
});
