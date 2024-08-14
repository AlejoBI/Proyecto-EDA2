import axios from './axios';

const API = 'http://localhost:3000/api';

export const registerRequest = async (user) => {
    const res = await axios.post(`/register`, user);
    return res.data;
}

export const loginRequest = async (user) => {
    const res = await axios.post(`/login`, user);
    return res.data;
}

export const verifyTokenRequest = () => axios.get(`/verify`);