import axios from 'axios';
import { LoginUserParams, SignUpUserParams, AuthResponse, VerifyTokenResponse } from '../utils/user';

const API_BASE_URL = 'http://localhost:3000/api';

export const login = async (data: LoginUserParams): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
};

export const signup = async (data: SignUpUserParams): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
    });
    return response.data;
};

export const verifyToken = async (): Promise<VerifyTokenResponse> => {
    const response = await axios.get(`${API_BASE_URL}/auth/verify-token`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
};

export const searchUsers = async (search: string, page: number): Promise<{ data: { email: string }[]; hasMore: boolean; total: number }> => {
    const pageSize = 10;
    const response = await axios.get(`${API_BASE_URL}/users/search`, {
        params: {
            email: search,
            page,
            pageSize
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });

    const { data, total } = response.data;

    return {
        data,
        hasMore: page * pageSize < total,
        total
    };
}