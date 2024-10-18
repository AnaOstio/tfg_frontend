import axiosInstance from "../config/axios";
import { LoginUserParams, SignUpUserParams } from "../utils/user";

export function login(data: LoginUserParams) {
    return axiosInstance.post('/login', data);
}

export function signup(data: SignUpUserParams) {
    return axiosInstance.post('/signup', data);
}