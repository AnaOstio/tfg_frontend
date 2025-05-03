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
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        status: string;
    };
};