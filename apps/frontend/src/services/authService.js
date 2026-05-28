import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const registerUser = (data) => api.post(ENDPOINTS.AUTH.REGISTER, data);
export const loginUser = (data) => api.post(ENDPOINTS.AUTH.LOGIN, data);
export const getMe = () => api.get(ENDPOINTS.AUTH.ME);
