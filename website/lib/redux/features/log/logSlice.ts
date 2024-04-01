import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ! This is a placeholder, import this from mongo model when its created
type LogRecord = {
    _id: string
    webhookId: string
    senderIp: string
    data: unknown
    successfulForwards: number
};

export type LogState = {
    loading: boolean
    error: boolean
    errorInfo?: string
    logs: LogRecord[]
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
        pushLog: (state, action: PayloadAction<LogRecord>) => {
            state.logs.push(action.payload);
        },
        deleteLogById: (state, action: PayloadAction<string>) => {
            state.logs = state.logs.filter((log) => log._id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<boolean>) => {
            state.error = action.payload;
        },
        setErrorWithInfo: (state, action: PayloadAction<{ error: boolean, errorInfo?: string }>) => {
            state.error = true;
            state.errorInfo = action.payload.errorInfo;
        },
        updateLogById: (state, action: PayloadAction<{ _id: string, log: Partial<LogRecord> }>) => {
            const index = state.logs.findIndex((log) => log._id === action.payload._id);
            if (index !== -1) {
                for(const key in action.payload.log) {
                    // @ts-expect-error this is safe, ill write the assertions later
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
    setErrorWithInfo,
    updateLogById
} = logSlice.actions;

export default logSlice.reducer;
