import { useMutation } from "@tanstack/react-query";
import { TitleMemoriesSearchParams } from "../utils/titleMemory";
import { titleMemoriesCreate, titleMemoriesDelete, titleMemoriesGetById, titleMemoriesSearch, titleMemoriesUpdate } from "../api/titleMemories";
import { message } from "antd"; // Asegúrate de importar message si usas antd
import { transformData } from "../helper/transformData";
import { useNavigate } from "react-router-dom";
import { assignPermissions, getPermissionsByMemoriesIds } from "../api/permissions";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";

interface UseTitleMemoriesSearchOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    setData: (data: any[]) => void;
    setPagination: (pagination: any) => void;
    setLoading: (loading: boolean) => void;
    setPermissions: (permissions: any[]) => void;
}

export const useTitleMemoriesSearch = ({
    setData,
    setPagination,
    setLoading,
    setPermissions
}: UseTitleMemoriesSearchOptions) => {
    return useMutation<any, Error, TitleMemoriesSearchParams>({
        mutationFn: titleMemoriesSearch,
        onSuccess: async (result) => {
            setData(result.data);

            setPagination({
                current: result.pagination.page,
                pageSize: result.pagination.limit,
                total: result.pagination.total,
            });
            setLoading(false);
            console.log('Datos obtenidos:', result);
            const toGet = result.data.map(item => item._id);
            try {
                const permissionsData = await getPermissionsByMemoriesIds(toGet);
                setPermissions(permissionsData.data);
                console.log('Permisos obtenidos:', permissionsData);
            } catch (permError) {
                console.error('Error al obtener permisos:', permError);
                // aquí podrías notificar de error si quieres
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            message.error('Error al cargar las memorias de título');
            console.error('Error:', error);
            setLoading(false);
        },
    });
};

export const useTitleMemoriesCreate = () => {
    const navigate = useNavigate();
    return useMutation<any, Error, any>({
        mutationFn: ({ data, users }) => {
            const transformed = transformData(data);
            return titleMemoriesCreate(transformed, users);
        },
        onSuccess: ([data, users], { currentUser }) => {
            if (users.length > 0) {
                users.forEach((user: any) => {
                    assignPermissions(user, data._id);
                });
                console.log('Usuarios asociados guardados:', users);
            }

            const owner = {
                email: currentUser?.email || '',
                roles: ['OWNER'],
            };
            // Asignar permisos al propietario
            assignPermissions(owner, data._id);

            navigate('/title-memory/details/' + data._id);
            console.log('Memoria de título creada:', data);
            message.success('Memoria de título creada con éxito');
        },
        onError: (error) => {
            message.error('Error al crear la memoria de título');
            console.error('Error:', error);
        },
    });
}

export const useTitleMemoriesUpdate = () => {
    const navigate = useNavigate();
    return useMutation<any, Error, any>({
        mutationFn: ({ id, ...rest }) => {
            const transformed = transformData(rest);
            return titleMemoriesUpdate(id, transformed);
        },
        onSuccess: (data) => {
            navigate('/title-memory/details/' + data._id);
            console.log('Memoria de título actualizada:', data);
            message.success('Memoria de título actualizada con éxito');
        },
        onError: (error) => {
            message.error('Error al actualizar la memoria de título');
            console.error('Error:', error);
        },
    });
}

export const useGetTileMemoryById = () => {
    const navigate = useNavigate();
    return useMutation<any, Error, string>({
        mutationFn: async (id) => {
            return titleMemoriesGetById(id);
        },
        onError: (error) => {
            console.error('Error al obtener la memoria de título:', error);
            navigate('/error');
        },
    });
}

export const useDeleteTitleMemory = () => {
    return useMutation<any, Error, string>({
        mutationFn: async (id) => {
            return titleMemoriesDelete(id);
        },
        onSuccess: () => {
            message.success('Memoria de título eliminada con éxito');
        },
        onError: (error) => {
            message.error('Error al eliminar la memoria de título');
            console.error('Error:', error);
        },
    });
}