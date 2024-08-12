import axios from 'axios';

const API = 'http://localhost:3000/api';

export const registerRequest = async (user) => {
    const res = await axios.post(`${API}/register`, user);
    return res.data;
}