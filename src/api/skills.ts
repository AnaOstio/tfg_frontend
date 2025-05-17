import axios from 'axios';
import { Skill } from '../utils/skill';

const API_BASE_URL = 'http://localhost:3001/api';

export const searchSkills = async ({
    search,
    page,
    type,
}: {
    search: string;
    page: number;
    type: string;
}): Promise<{ data: Skill[]; hasMore: boolean; total: number }> => {
    const pageSize = 10;

    const response = await axios.get(`${API_BASE_URL}/skills/search`, {
        params: {
            search,
            page,
            pageSize,
            type,
        },
    });

    const { data, total } = response.data;

    return {
        data,
        hasMore: page * pageSize < total,
        total,
    };
};
