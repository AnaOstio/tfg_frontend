import { useMutation } from '@tanstack/react-query';
import { login, searchUsers, signup, verifyToken } from '../api/users';
import { useNavigate } from 'react-router-dom';
import { LoginUserParams, SignUpUserParams, AuthResponse } from '../utils/user';
import { message } from 'antd';
import { useAppDispatch } from '../redux/hooks';
import { clearCredentials, setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

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
            toast.success(`Bienvenido ${data.data.user.email}`);
            navigate('/dashboard');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al iniciar sesión');
            toast.error('Lo sentimos, ha ocurrido un error');
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
            toast.success('Usuario registrado correctamente');
            navigate('/dashboard');
        },
        onError: (error) => {
            toast.error('Lo sentimos, ha ocurrido un error');
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
        toast.success('Sesión cerrada correctamente');
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
            toast.error('Lo sentimos, tu sesión ha expirado');
        }
    });
};


// 1) Define el tipo de las variables que vas a recibir al llamar al mutate
interface SearchUsersVariables {
    search: string
    page: number
}

export const useSearchUsers = () => {
    return useMutation<
        { data: { email: string }[]; hasMore: boolean; total: number },
        Error,
        SearchUsersVariables
    >({
        mutationFn: ({ search, page }) => searchUsers(search, page),

        onError: (error) => {
            console.error('Error buscando usuarios:', error)
            toast.error('Lo sentimos, ha ocurrido un error');
        },
        onSuccess: (data) => {
            console.log('Usuarios recibidos:', data)

        }
    })
}