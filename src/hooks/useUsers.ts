import { useMutation } from '@tanstack/react-query';
import { login, signup } from '../api/users';
import { useNavigate } from 'react-router-dom';
import { LoginUserParams, SignUpUserParams, AuthResponse } from '../utils/user';
import { message } from 'antd';

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation<AuthResponse, Error, LoginUserParams>({
        mutationFn: async (credentials: LoginUserParams) => {
            if (!credentials.email || !credentials.password) {
                throw new Error('Email y contraseña son requeridos');
            }
            return login(credentials);
        },
        onSuccess: (data) => {
            localStorage.setItem('authToken', data.token);
            message.success(`Bienvenido ${data.user.email}`);
            navigate('/dashboard');
        },
        onError: (error) => {
            message.error(error.message || 'Error al iniciar sesión');
        }
    });
};

export const useSignup = () => {
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
            message.success(`Cuenta creada para ${data.user.email}`);
            localStorage.setItem('authToken', data.token);
            navigate('/dashboard');
        },
        onError: (error) => {
            message.error(error.message || 'Error al registrarse');
        }
    });
};