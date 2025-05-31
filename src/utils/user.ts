export type LoginUserParams = {
    email: string;
    password: string;
};

export type SignUpUserParams = {
    email: string;
    password: string;
    confirmPassword: string;
};

export type AuthResponse = {
    data: {
        token: string;
        user: {
            _id: string;
            email: string;
            role: string;
            accountStatus: string;
        }
    };
};

export interface VerifyTokenResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
    };
}