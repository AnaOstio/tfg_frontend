import axios from 'axios';
import { LoginUserParams, SignUpUserParams, AuthResponse } from '../utils/user';

const API_BASE_URL = 'http://localhost:3000/api';

export const login = async (data: LoginUserParams): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
};

export const signup = async (data: SignUpUserParams): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: data.email,
        password: data.password,
        passwordConfirmation: data.confirmPassword
    });
    return response.data;
};