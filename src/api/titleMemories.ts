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

export const titleMemoriesCreate = async (data: any, users: any): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/title-memories`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return [response.data, users];
};

export const titleMemoriesGetById = async (id: string): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/title-memories/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
}

export const titleMemoriesUpdate = async (id: string, data: any): Promise<any> => {
    const response = await axios.put(`${API_BASE_URL}/title-memories/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
};

export const titleMemoriesDelete = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/title-memories/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
}

export const titleMemoryFromFile = async (files: File[]): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/title-memories/from-file`, files, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
}

export const getTitleMemoriesByUser = async (): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/title-memories/user/memories`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
}
