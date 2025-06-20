import axios from "axios";


const API_BASE_URL = 'http://localhost:3002/api';

export const titleSubjectsCreate = async (data: any): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/subjects`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
};

export const titleSubjectsGetByTitleMemoryId = async (titleMemoryId: string): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/subjects/by-memory/${titleMemoryId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
}