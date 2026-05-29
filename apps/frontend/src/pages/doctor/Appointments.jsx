// apps/frontend/src/pages/doctor/Appointments.jsx
import { useEffect, useState } from 'react';
import { fetchDoctorAppointments, updateAppointmentStatus } from '../../services/appointmentService';
import AppointmentTable from '../../components/appointment/AppointmentTable';
import AppointmentTabs from '../../components/appointment/AppointmentTabs';
import SearchBar from '../../components/common/SearchBar';
import Loader from '../../components/common/Loader';
import RescheduleModal from "../../components/appointment/RescheduleModal";

const URGENCY_FILTERS = ['', 'NORMAL', 'IMPORTANT', 'URGENT'];

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [search, setSearch] = useState('');
  const [urgency, setUrgency] = useState('');
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const load = () => {
    const params = {};
    if (activeTab) params.status = activeTab;
    if (search) params.search = search;
    if (urgency) params.urgency = urgency;

    setLoading(true);
    fetchDoctorAppointments(params)
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [activeTab, search, urgency]);

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, { status });
      load();
    } catch {}
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">Review, approve, and manage patient appointments.</p>
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by patient name..." />
        </div>
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="input-field sm:w-40"
        >
          <option value="">All Urgency</option>
          <option value="NORMAL">Normal</option>
          <option value="IMPORTANT">Important</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <AppointmentTabs active={activeTab} onChange={setActiveTab} />

      <div className="card p-5">
        {loading ? (
          <Loader />
        ) : (
          <AppointmentTable
            appointments={appointments}
            role="DOCTOR"
            onStatusChange={handleStatus}
            onReschedule={setRescheduleTarget}
          />
        )}
      </div>

      {/* ✅ Modal — renders only when a target is set */}
      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onSuccess={() => {
            setRescheduleTarget(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;