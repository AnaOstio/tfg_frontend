// hooks/useSkillSearch.ts
import { useMutation } from '@tanstack/react-query';
import { Skill } from '../utils/skill';
import { getSkillsByIds, searchSkills } from '../api/skills';
import { toast } from 'react-toastify';

interface SkillSearchParams {
    search: string;
    page: number;
    type: string; // basic, general, etc.
}

interface SkillSearchResponse {
    data: Skill[];
    hasMore: boolean;
    total: number;
}

interface UseSkillSearchOptions {
    onSuccess?: (data: SkillSearchResponse) => void;
    onError?: (error: Error) => void;
    setLoading?: (loading: boolean) => void;
}

export const useSkillSearch = ({ onSuccess, onError, setLoading }: UseSkillSearchOptions = {}) => {
    return useMutation<SkillSearchResponse, Error, SkillSearchParams>({
        mutationFn: searchSkills,
        onMutate: () => {
            setLoading?.(true);
        },
        onSuccess: (result) => {
            onSuccess?.(result);
            setLoading?.(false);
        },
        onError: (error) => {
            toast.error('Error al buscar competencias');
            console.error('Error:', error);
            onError?.(error);
            setLoading?.(false);
        },
    });
};

export const useGetSkillsByIds = () => {
    return useMutation<any, Error, string[]>({
        mutationFn: async (ids) => {
            return getSkillsByIds(ids);
        },
        onError: (error) => {
            console.error('Error al obtener habilidades por IDs:', error);
            toast.error('Error al obtener habilidades');
        },
    });
}