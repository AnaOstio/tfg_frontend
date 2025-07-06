import { useMutation } from "@tanstack/react-query"
import { getSimilars, getSimilarsOutcomes } from "../api/similars"
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