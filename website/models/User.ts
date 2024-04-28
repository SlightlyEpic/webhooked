import { ObjectId } from 'mongodb';
import { z } from 'zod';

export type User = {
    _id: ObjectId
    username: string
    avatar: string
    registeredAt: Date
    lastSignIn: Date
    webhooks: ObjectId[]
    deletedWebhooks: ObjectId[]
};

export const userSchema = z.object({
    _id: z.optional(z.string()),
    username: z.string().min(1, 'username cannot be empty'),
    avatar: z.string().url('avatar must be a url'),
    registeredAt: z.coerce.date(),
    lastSignIn: z.coerce.date(),
    webhooks: z.array(z.string()),
    deletedWebhooks: z.array(z.string())
});
