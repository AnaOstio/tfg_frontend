import { useAppSelector } from '../hooks';
import { selectCurrentUser, selectIsAuthenticated } from '../slices/authSlice';

export const useAuthState = () => {
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    return { user, isAuthenticated };
};