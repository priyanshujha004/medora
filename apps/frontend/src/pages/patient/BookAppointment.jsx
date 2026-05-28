import { Navigate } from 'react-router-dom';

// Booking is handled inline on DoctorDetails as per SRS
const BookAppointment = () => <Navigate to="/patient/doctors" replace />;

export default BookAppointment;
