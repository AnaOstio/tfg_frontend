import axiosInstance from "../config/axios";
import { LoginUserParams } from "../utils/user";

export function login(data: LoginUserParams) {
    return axiosInstance.post('/login', data);
}
