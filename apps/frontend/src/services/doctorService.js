import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const fetchDoctors = (params) => api.get(ENDPOINTS.DOCTORS.LIST, { params });
export const fetchDoctorById = (id) => api.get(ENDPOINTS.DOCTORS.BY_ID(id));
export const updateDoctorProfile = (data) => api.put(ENDPOINTS.DOCTORS.PROFILE, data);
