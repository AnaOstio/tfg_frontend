import { useMutation } from '@tanstack/react-query';
import { LearningOutcome } from '../utils/titleMemory';
import { searchLearningOutcomes } from '../api/learningOutcomes';
import { toast } from 'react-toastify';

interface LearningOutcomeSearchParams {
    search: string;
    page: number;
}

interface LearningOutcomeSearchResponse {
    data: LearningOutcome[];
    hasMore: boolean;
    total: number;
}

interface UseLearningOutcomesSearchOptions {
    onSuccess?: (data: LearningOutcomeSearchResponse) => void;
    onError?: (error: Error) => void;
    setLoading?: (loading: boolean) => void;
}

export const useLearningOutcomesSearch = ({ onSuccess, onError, setLoading }: UseLearningOutcomesSearchOptions = {}) => {
    return useMutation<LearningOutcomeSearchResponse, Error, LearningOutcomeSearchParams>({
        mutationFn: searchLearningOutcomes,
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
