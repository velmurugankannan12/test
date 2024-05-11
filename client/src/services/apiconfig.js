import axios from 'axios';

export const serverURL = 'http://localhost:4000';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
});

