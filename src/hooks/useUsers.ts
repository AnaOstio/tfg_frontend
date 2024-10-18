import { login, signup } from '../api/users';
import { useMutation } from '@tanstack/react-query';
import { LoginUserParams, SignUpUserParams } from '../utils/user';
import { toast } from 'react-toastify';

export const useLogin = () => {
    return useMutation({
        mutationFn: async ({ email, password }: LoginUserParams) => {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            return login({ email, password });
        },
        onError: (error) => {
            console.error('Error logging in:', error);
            toast.error("This is a toast notification !");
        },
        onSuccess: () => {
            console.log('Login successful!');
        }
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: async ({ email, password, repeatPassword }: SignUpUserParams) => {
            // aqui tengo que meter validaciones
            return signup({ email, password, repeatPassword });
        },
        onSuccess: () => {
            console.log('Sign up successful!');
        }
    });
}
