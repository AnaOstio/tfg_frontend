import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import titleMemoryReducer from './slices/titleMemorySlice';
import universitiesReducer from './slices/universitiesSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key: 'root', // clave para el localStorage
    storage,
    whitelist: ['auth'], // solo persiste el slice 'auth'
    // blacklist: ['auth'] // alternativamente, excluye slices
};

const rootReducer = combineReducers({
    auth: authReducer,
    titleMemory: titleMemoryReducer,
    universities: universitiesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
            ignoredPaths: ['_persist'],
        },
    }),
    devTools: import.meta.env.MODE !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;