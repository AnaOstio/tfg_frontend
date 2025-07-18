import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_SUBJECTS_API_URL!;

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

export const titleSubjectsGetById = async (subjectId: string): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/subjects/${subjectId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
};

export const titleSubjectsUpdate = async (subjectId: string, data: any): Promise<any> => {
    const response = await axios.put(`${API_BASE_URL}/subjects/${subjectId}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
};

export const titleSubjectsDelete = async (subjectId: string): Promise<any> => {
    const response = await axios.delete(`${API_BASE_URL}/subjects/${subjectId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
};

export const subjectFromFile = async (data: any): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/subjects/from-file`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
}