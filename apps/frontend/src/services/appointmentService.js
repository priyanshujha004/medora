import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const bookAppointment = (data) => api.post(ENDPOINTS.APPOINTMENTS.BOOK, data);
export const fetchPatientAppointments = () => api.get(ENDPOINTS.APPOINTMENTS.PATIENT);
export const fetchDoctorAppointments = (params) =>
  api.get(ENDPOINTS.APPOINTMENTS.DOCTOR, { params });
export const updateAppointmentStatus = (id, data) =>
  api.patch(ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id), data);
