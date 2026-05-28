import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPatientAppointments } from '../../services/appointmentService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';

const statusClass = {
  PENDING: 'status-pending',
  APPROVED: 'status-approved',
  REJECTED: 'status-rejected',
  COMPLETED: 'status-completed',
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'PENDING').length,
    approved: appointments.filter((a) => a.status === 'APPROVED').length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your health appointments from here.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-700' },
          { label: 'Pending', value: stats.pending, color: 'text-blue-600' },
          { label: 'Approved', value: stats.approved, color: 'text-green-600' },
          { label: 'Completed', value: stats.completed, color: 'text-gray-500' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to="/patient/doctors" className="btn-primary text-sm">
          Find a Doctor
        </Link>
        <Link to="/patient/appointments" className="btn-secondary text-sm">
          View All Appointments
        </Link>
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Appointments</h2>
        </div>
        {loading ? (
          <Loader />
        ) : appointments.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-gray-500 text-sm">No appointments yet.</p>
            <Link to="/patient/doctors" className="btn-primary text-sm mt-4 inline-block">
              Book your first appointment
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments.slice(0, 5).map((appt) => (
              <li key={appt.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm text-gray-900">{appt.doctor?.user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {appt.slot ? `${formatDate(appt.slot.date)} · ${appt.slot.startTime}` : '—'}
                  </p>
                </div>
                <span className={statusClass[appt.status]}>{appt.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
