import { useMutation } from '@tanstack/react-query';
import { login, signup, verifyToken } from '../api/users';
import { useNavigate } from 'react-router-dom';
import { LoginUserParams, SignUpUserParams, AuthResponse } from '../utils/user';
import { message } from 'antd';
import { useAppDispatch } from '../redux/hooks';
import { clearCredentials, setCredentials } from '../redux/slices/authSlice';

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return useMutation<AuthResponse, Error, LoginUserParams>({
        mutationFn: async (credentials: LoginUserParams) => {
            if (!credentials.email || !credentials.password) {
                throw new Error('Email y contraseña son requeridos');
            }
            return login(credentials);
        },
        onSuccess: (data) => {
            dispatch(setCredentials(data)); // Guarda en Redux
            localStorage.setItem('authToken', data.data.token);
            message.success(`Bienvenido ${data.data.user.email}`);
            navigate('/dashboard');
        },
        onError: (error) => {
            message.error(error.message || 'Error al iniciar sesión');
        }
    });
};

export const useSignup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return useMutation<AuthResponse, Error, SignUpUserParams>({
        mutationFn: async (credentials: SignUpUserParams) => {
            if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
                throw new Error('Todos los campos son requeridos');
            }

            if (credentials.password !== credentials.confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            return signup(credentials);
        },
        onSuccess: (data) => {
            dispatch(setCredentials(data)); // Guarda en Redux
            localStorage.setItem('authToken', data.data.token);
            message.success(`Cuenta creada para ${data.data.user.email}`);
            navigate('/dashboard');
        },
        onError: (error) => {
            message.error(error.message || 'Error al registrarse');
        }
    });
};

export const useLogout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return () => {
        dispatch(clearCredentials());
        localStorage.removeItem('authToken');
        navigate('/');
    };
}

export const useVerifyToken = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async () => {
            return verifyToken();
        },
        onError: (_) => {
            dispatch(clearCredentials());
            localStorage.removeItem('authToken');
            message.error('La sesión ha expirado');
        }
    });
};