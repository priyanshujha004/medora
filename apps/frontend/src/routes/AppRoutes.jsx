import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import PatientDashboard from '../pages/patient/Dashboard';
import Doctors from '../pages/patient/Doctors';
import DoctorDetails from '../pages/patient/DoctorDetails';
import BookAppointment from '../pages/patient/BookAppointment';
import AppointmentHistory from '../pages/patient/AppointmentHistory';
import PatientProfile from '../pages/patient/Profile';

import DoctorDashboard from '../pages/doctor/Dashboard';
import ManageSlots from '../pages/doctor/ManageSlots';
import DoctorAppointments from '../pages/doctor/Appointments';
import DoctorProfile from '../pages/doctor/Profile';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route element={<MainLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Patient dashboard */}
    <Route
      element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/doctors" element={<Doctors />} />
      <Route path="/patient/doctors/:id" element={<DoctorDetails />} />
      <Route path="/patient/book" element={<BookAppointment />} />
      <Route path="/patient/appointments" element={<AppointmentHistory />} />
      <Route path="/patient/profile" element={<PatientProfile />} />
    </Route>

    {/* Doctor dashboard */}
    <Route
      element={
        <ProtectedRoute allowedRoles={['DOCTOR']}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/slots" element={<ManageSlots />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
    </Route>

    {/* Fallback */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              localStorage.getItem('token')
                ? '/patient/dashboard'
                : '/login'
            }
            replace
          />
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
