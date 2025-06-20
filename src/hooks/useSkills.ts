// hooks/useSkillSearch.ts
import { useMutation } from '@tanstack/react-query';
import { Skill } from '../utils/skill';
import { searchSkills } from '../api/skills';
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
