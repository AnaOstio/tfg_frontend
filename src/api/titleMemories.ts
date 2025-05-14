import axios from "axios";

const API_BASE_URL = 'http://localhost:3003/api';

export const titleMemoriesSearch = async (params: any): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/title-memories/search`, params, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
};