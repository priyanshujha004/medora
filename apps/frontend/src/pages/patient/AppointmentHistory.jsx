import { useEffect, useState } from 'react';
import { fetchPatientAppointments } from '../../services/appointmentService';
import AppointmentTable from '../../components/appointment/AppointmentTable';
import AppointmentTabs from '../../components/appointment/AppointmentTabs';
import Loader from '../../components/common/Loader';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  const load = () => {
    setLoading(true);
    fetchPatientAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    load();
  
    // Re-fetch when patient returns to this tab — catches doctor-side updates
    const handleFocus = () => load();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const filtered = activeTab ? appointments.filter((a) => a.status === activeTab) : appointments;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-500 text-sm mt-1">Track the status of all your bookings.</p>
          </div>
        <button
          onClick={load}
          className="text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
        >
       ↻ Refresh
        </button>
    </div>

      <AppointmentTabs active={activeTab} onChange={setActiveTab} />

      <div className="card p-5">
        {loading ? <Loader /> : <AppointmentTable appointments={filtered} role="PATIENT" />}
      </div>
    </div>
  );
};

export default AppointmentHistory;
