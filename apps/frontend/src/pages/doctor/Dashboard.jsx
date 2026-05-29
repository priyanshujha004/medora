import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctorAppointments, updateAppointmentStatus } from '../../services/appointmentService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';

const urgencyClass = { NORMAL: 'badge-normal', URGENT: 'badge-urgent', IMPORTANT: 'badge-important' };

// Returns today's date in YYYY-MM-DD format matching slot.date
const getTodayStr = () => new Date().toISOString().split('T')[0];

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('pending'); // 'pending' | 'today'

  const load = () => {
    setLoading(true);
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

  // Today's appointments — APPROVED (incl. rescheduled) with slot date = today
  const todayStr = getTodayStr();
  const todayAppointments = appointments.filter((a) => {
    if (a.status !== 'APPROVED') return false;
    if (!a.slot?.date) return false;
    const slotDate = new Date(a.slot.date).toISOString().split('T')[0];
    return slotDate === todayStr;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your appointments and availability.</p>
      </div>

      {/* Stats */}
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

      {/* Quick links */}
      <div className="flex gap-3">
        <Link to="/doctor/slots" className="btn-primary text-sm">Manage Slots</Link>
        <Link to="/doctor/appointments" className="btn-secondary text-sm">All Appointments</Link>
      </div>

      {/* Tab toggle — Pending Requests / Today's Appointments */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          {/* Tab buttons */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveSection('pending')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSection === 'pending'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Requests
              {pending.length > 0 && (
                <span className="ml-1.5 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-xs">
                  {pending.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection('today')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSection === 'today'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Today's Appointments
              {todayAppointments.length > 0 && (
                <span className="ml-1.5 bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full text-xs">
                  {todayAppointments.length}
                </span>
              )}
            </button>
          </div>

          {/* Date indicator */}
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {loading ? (
          <Loader />
        ) : activeSection === 'pending' ? (
          // Pending requests list
          pending.length === 0 ? (
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
          )
        ) : (
          // Today's appointments list
          todayAppointments.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              No appointments scheduled for today.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todayAppointments.map((appt) => (
                <li key={appt.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {appt.patient?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{appt.reason}</p>
                      {appt.slot && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {appt.slot.startTime} – {appt.slot.endTime}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={urgencyClass[appt.urgency]}>{appt.urgency}</span>
                      {/* ✅ Only Complete action here — already approved */}
                      <button
                        onClick={() => handleStatus(appt.id, 'COMPLETED')}
                        className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;