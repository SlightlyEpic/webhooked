import { configureStore } from '@reduxjs/toolkit';
import logReducer from './features/log/logSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            log: logReducer
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
