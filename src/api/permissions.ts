import axios from "axios";

export interface UsersRoles {
    email: string;
    roles: string[];
}

export const assignPermissions = async (user: UsersRoles, memoryId: string): Promise<void> => {
    const API_BASE_URL = 'http://localhost:3000/api/permissions';

    try {
        await axios.post(
            `${API_BASE_URL}`,
            {
                userId: user.email,
                permissions: user.roles,
                memoryId: memoryId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }
        );
    } catch (error) {
        console.error('Error assigning permissions:', error);
        throw error;
    }
}