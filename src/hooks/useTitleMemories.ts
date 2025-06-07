import { useMutation } from "@tanstack/react-query";
import { TitleMemoriesSearchParams } from "../utils/titleMemory";
import { titleMemoriesCreate, titleMemoriesGetById, titleMemoriesSearch, titleMemoriesUpdate } from "../api/titleMemories";
import { message } from "antd"; // Asegúrate de importar message si usas antd
import { transformData } from "../helper/transformData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { set } from "lodash";
import { assignPermissions } from "../api/permissions";

interface UseTitleMemoriesSearchOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    setData: (data: any[]) => void;
    setPagination: (pagination: any) => void;
    setLoading: (loading: boolean) => void;
}

export const useTitleMemoriesSearch = ({
    setData,
    setPagination,
    setLoading,
}: UseTitleMemoriesSearchOptions) => {
    return useMutation<any, Error, TitleMemoriesSearchParams>({
        mutationFn: titleMemoriesSearch,
        onSuccess: (result) => {
            setData(result.data);
            setPagination((prev: any) => ({ ...prev, total: result.total }));
            setLoading(false);
            console.log('Datos obtenidos:', result);
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
        onSuccess: ([data, users]) => {
            if (users.length > 0) {
                users.forEach((user: any) => {
                    assignPermissions(user, data._id);
                });
                console.log('Usuarios asociados guardados:', users);
            }
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