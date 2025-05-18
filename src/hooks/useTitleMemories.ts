import { useMutation } from "@tanstack/react-query";
import { TitleMemoriesSearchParams } from "../utils/titleMemory";
import { titleMemoriesCreate, titleMemoriesSearch } from "../api/titleMemories";
import { message } from "antd"; // Asegúrate de importar message si usas antd
import { transformData } from "../helper/transformData";
import { useNavigate } from "react-router-dom";

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
        mutationFn: (data) => {
            const transformed = transformData(data);
            return titleMemoriesCreate(transformed);
        },
        onSuccess: (data) => {
            navigate('/title-memories');
            console.log('Memoria de título creada:', data);
            message.success('Memoria de título creada con éxito');
        },
        onError: (error) => {
            message.error('Error al crear la memoria de título');
            console.error('Error:', error);
        },
    });
}