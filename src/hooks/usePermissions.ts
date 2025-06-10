import { useMutation } from '@tanstack/react-query';
import { getPermissionsByMemoriesIds } from '../api/permissions';


export const useGetPermissionsByMemoriesIds = () => {
    return useMutation({
        mutationFn: async (memoryIds: string[]) => {
            if (!memoryIds || memoryIds.length === 0) {
                throw new Error('Debe proporcionar al menos un ID de memoria');
            }
            return getPermissionsByMemoriesIds(memoryIds);
        },
        onError: (error) => {
            console.error('Error al obtener permisos por IDs de memoria:', error);
            throw error;
        }
    });
}
