import axios from 'axios';

export const serverURL = 'http://139.59.18.42:4000';

export const axiosInstance = axios.create({
    baseURL: 'http://139.59.18.42:4000',
});

