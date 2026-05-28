import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const fetchDoctorSlots = (doctorId, params) =>
  api.get(ENDPOINTS.SLOTS.BY_DOCTOR(doctorId), { params });
export const createSlot = (data) => api.post(ENDPOINTS.SLOTS.CREATE, data);
export const deleteSlot = (id) => api.delete(ENDPOINTS.SLOTS.DELETE(id));
