import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type WebhookLogEntry } from '@/models/WebhookLogEntry';

export type LogState = {
    loading: boolean
    error: boolean
    errorInfo?: string
    logs: WebhookLogEntry[]
};

const initialState: LogState = {
    loading: false,
    error: false,
    logs: [],
};

export const logSlice = createSlice({
    name: 'log',
    initialState,
    reducers: {
        pushLog: (state, action: PayloadAction<WebhookLogEntry>) => {
            state.logs.push(action.payload);
        },
        deleteLogById: (state, action: PayloadAction<Date>) => {
            state.logs = state.logs.filter(log => log._id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<{ error: boolean, errorInfo?: string }>) => {
            state.error = true;
            state.errorInfo = action.payload.errorInfo;
        },
        updateLogById: (state, action: PayloadAction<{ id: Date, log: Partial<WebhookLogEntry> }>) => {
            const index = state.logs.findIndex(log => log._id === action.payload.id);
            if (index !== -1) {
                for(const key in action.payload.log) {
                    // @ts-expect-error this is safe
                    state.logs[index][key] = action.payload.log[key];
                }
            }
        }
    }
});

export const {
    pushLog,
    deleteLogById,
    setLoading,
    setError,
    updateLogById
} = logSlice.actions;

export default logSlice.reducer;
