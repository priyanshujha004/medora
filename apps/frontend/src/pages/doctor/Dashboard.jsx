import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctorAppointments } from '../../services/appointmentService';
import { updateAppointmentStatus } from '../../services/appointmentService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';

const urgencyClass = { NORMAL: 'badge-normal', URGENT: 'badge-urgent', IMPORTANT: 'badge-important' };

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetchDoctorAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, { status });
      load();
    } catch {}
  };

  const pending = appointments.filter((a) => a.status === 'PENDING');
  const approved = appointments.filter((a) => a.status === 'APPROVED');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your appointments and availability.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: appointments.length, color: 'text-gray-700' },
          { label: 'Pending', value: pending.length, color: 'text-blue-600' },
          { label: 'Approved', value: approved.length, color: 'text-green-600' },
          { label: 'Completed', value: appointments.filter((a) => a.status === 'COMPLETED').length, color: 'text-gray-500' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to="/doctor/slots" className="btn-primary text-sm">Manage Slots</Link>
        <Link to="/doctor/appointments" className="btn-secondary text-sm">All Appointments</Link>
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Pending Requests</h2>
          <span className="text-xs text-blue-600 font-medium">{pending.length} new</span>
        </div>
        {loading ? (
          <Loader />
        ) : pending.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-500">No pending requests.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pending.slice(0, 5).map((appt) => (
              <li key={appt.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{appt.patient?.user?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{appt.reason}</p>
                    {appt.slot && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(appt.slot.date)} · {appt.slot.startTime}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={urgencyClass[appt.urgency]}>{appt.urgency}</span>
                    <button
                      onClick={() => handleStatus(appt.id, 'APPROVED')}
                      className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(appt.id, 'REJECTED')}
                      className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-medium"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
