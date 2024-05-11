import axios from 'axios';

export const serverURL = 'http://139.59.18.42:4000';
// export const serverURL = 'http://localhost:4000';

export const fileURL = 'https://blog-cms-telecmi.s3.ap-southeast-2.amazonaws.com';

export const axiosInstance = axios.create({
    baseURL: 'http://139.59.18.42:4000',
    // baseURL: 'http://localhost:4000',
});

