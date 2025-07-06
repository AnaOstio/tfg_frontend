
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const getSimilars = async (data: any): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/similars?page=${data.page}&limit=${data.limit}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
}

export const getSimilarsOutcomes = async (data: any): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/similars/outcomes?page=${data.page}&limit=${data.limit}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data;
}
