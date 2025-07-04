import axios from 'axios';

const API_URL = 'http://localhost:8082/admin/users';

export const getAllUsers = () => axios.get(API_URL);

export const getUserById = (id) => axios.get(`${API_URL}/${id}`);

export const createUser = (user) => axios.post(API_URL, user);

export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);

export const updateUser = (id, user) => axios.put(`${API_URL}/${id}`, user);

export const changeUserRole = (id, role) => 
    axios.patch(`${API_URL}/${id}/role?role=${role}`);
