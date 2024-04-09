import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type WebhookInfo } from '@/models/WebhookInfo';

export type WebhooksState = {
    loading: boolean
    error: boolean
    errorInfo?: string
    webhooks: WebhookInfo[]
};

const initialState: WebhooksState = {
    loading: false,
    error: false,
    webhooks: [],
};

export const webhookSlice = createSlice({
    name: 'webhook',
    initialState,
    reducers: {
        addWebhook: (state, action: PayloadAction<WebhookInfo>) => {
            state.webhooks.push(action.payload);
            state.webhooks.sort((a, b) => a.created.getTime() - b.created.getTime());
        },
        deleteWebhookById: (state, action: PayloadAction<string>) => {
            state.webhooks = state.webhooks.filter(hook => hook._id.toHexString() !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<{ error: boolean, errorInfo?: string }>) => {
            state.error = true;
            state.errorInfo = action.payload.errorInfo;
        },
        updateWebhookById: (state, action: PayloadAction<{ id: string, webhook: Partial<WebhookInfo> }>) => {
            const index = state.webhooks.findIndex(hook => hook._id.toHexString() === action.payload.id);
            if (index !== -1) {
                for(const key in action.payload.webhook) {
                    // @ts-expect-error this is safe
                    state.logs[index][key] = action.payload.webhook[key];
                }
            }
        }
    }
});

export const {
    addWebhook: pushLog,
    deleteWebhookById,
    setLoading,
    setError,
    updateWebhookById: updateLogById
} = webhookSlice.actions;

export default webhookSlice.reducer;
