import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../../utils/user';
import { RootState } from '../store';

interface AuthState {
    user: {
        id: string;
        email: string;
        role: string;
        status: string;
    } | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
    user: null,
    token: null,
    status: 'idle',
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            state.user = {
                id: action.payload.data.user._id,
                email: action.payload.data.user.email,
                role: action.payload.data.user.role,
                status: action.payload.data.user.accountStatus,
            };
            state.token = action.payload.data.token;
            state.status = 'succeeded';
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.status = action.payload ? 'loading' : 'idle';
        },
    },
});

export const { setCredentials, clearCredentials, setLoading } = authSlice.actions;

// Selectores
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === 'admin';

export default authSlice.reducer;