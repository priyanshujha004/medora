export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PATIENT_PROFILE: '/auth/patient/profile',
  },
  DOCTORS: {
    LIST: '/doctors',
    BY_ID: (id) => `/doctors/${id}`,
    PROFILE: '/doctors/profile',
  },
  SLOTS: {
    BY_DOCTOR: (doctorId) => `/slots/doctor/${doctorId}`,
    CREATE: '/slots',
    DELETE: (id) => `/slots/${id}`,
  },
  APPOINTMENTS: {
    BOOK: '/appointments',
    PATIENT: '/appointments/patient',
    DOCTOR: '/appointments/doctor',
    UPDATE_STATUS: (id) => `/appointments/${id}/status`,
  },
  SPECIALITIES: '/doctors/specialities',
};
