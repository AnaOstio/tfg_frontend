import axios from 'axios';
import { LearningOutcome } from '../utils/titleMemory';

const API_BASE_URL = import.meta.env.VITE_SKILLS_API_URL!;

export const searchLearningOutcomes = async ({
    search,
    page,
}: {
    search: string;
    page: number;
}): Promise<{ data: LearningOutcome[]; hasMore: boolean; total: number }> => {
    const pageSize = 10;

    const response = await axios.get(`${API_BASE_URL}/learning-outcomes/search`, {
        params: {
            search,
            page,
            pageSize,
        },
    });

    const { data, total } = response.data;

    return {
        data,
        hasMore: page * pageSize < total,
        total,
    };
};
