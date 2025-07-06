import { useMutation } from "@tanstack/react-query"
import { getSimilars, getSimilarsOutcomes, updateSimilars, updateSimilarsOutcomes } from "../api/similars"
import { toast } from "react-toastify";


export const useSimilarsGet = () => {
    return useMutation<any, Error, any>({
        mutationFn: async (data) => {
            return getSimilars(data);
        },
        onError: (error) => {
            toast.error('Error al buscar competencias');
            console.error('Error:', error);
        },
    });
};

export const useSimilarLOsGet = () => {
    return useMutation<any, Error, any>({
        mutationFn: async (data) => {
            return getSimilarsOutcomes(data);
        },
        onError: (error) => {
            toast.error('Error al buscar competencias');
            console.error('Error:', error);
        },
    });
};

export const useUpdateSimilars = () => {
    return useMutation<any, Error, any>({
        mutationFn: async (data) => {
            return updateSimilars(data);
        },
        onSuccess: () => {
            toast.success('Similitudes actualizadas correctamente');
        },
        onError: (error) => {
            toast.error('Error al actualizar similitudes');
            console.error('Error:', error);
        },
    });
}

export const useUpdateSimilarsOutcomes = () => {
    return useMutation<any, Error, any>({
        mutationFn: async (data) => {
            return updateSimilarsOutcomes(data);
        },
        onSuccess: () => {
            toast.success('Similitudes actualizadas correctamente');
        },
        onError: (error) => {
            toast.error('Error al actualizar similitudes');
            console.error('Error:', error);
        },
    });
}