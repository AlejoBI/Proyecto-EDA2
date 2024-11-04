import axios from './axios';

export const createUserRequest = async (user) => {
    const res = await axios.post(`/createUser`, user);
    return res.data;
}

export const deleteUserRequest = async (userId) => {
    const res = await axios.delete(`/deleteUser/${userId}`);
    return res.data;
}