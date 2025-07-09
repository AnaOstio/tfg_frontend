import axios from "axios";

export interface UsersRoles {
    email: string;
    roles: string[];
}

const API_BASE_URL = import.meta.env.VITE_USERS_API_URL!;


export const assignPermissions = async (user: UsersRoles, memoryId: string): Promise<void> => {
    try {
        await axios.post(
            `${API_BASE_URL}/permissions`,
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

export const getPermissionsByMemoriesIds = async (memoryIds: string[]): Promise<any> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/permissions/getByMemoryIds`,
            memoryIds,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
        console.log('Permissions fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw error;
    }
}