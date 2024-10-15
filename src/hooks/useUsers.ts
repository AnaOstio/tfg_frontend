import { login } from '../api/users';
import { useMutation } from '@tanstack/react-query';
import { LoginUserParams } from '../utils/user';

export const useLogin = () => {
    return useMutation({
        mutationFn: async ({ email, password }: LoginUserParams) => {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            return login({ email, password });
        },
    });
};