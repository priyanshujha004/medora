import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDoctorById } from '../../services/doctorService';
import { fetchDoctorSlots } from '../../services/slotService';
import { bookAppointment } from '../../services/appointmentService';
import Loader from '../../components/common/Loader';
import SlotCard from '../../components/doctor/SlotCard';
import { URGENCY_OPTIONS } from '../../utils/constants';

const getTodayStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('NORMAL');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchDoctorById(id), fetchDoctorSlots(id, { availableOnly: 'true' })])
      .then(([docRes, slotsRes]) => {
        setDoctor(docRes.data);
        setSlots(slotsRes.data);
      })
      .catch(() => setError('Failed to load doctor details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!selectedSlot || !reason.trim()) {
      setError('Please Select a Slot and Enter a Reason.');
      return;
    }
    setError('');
    setBooking(true);
    try {
      await bookAppointment({ doctorId: id, slotId: selectedSlot.id, reason, urgency });
      navigate('/patient/appointments');
    } catch (err) {
      const message = err.response?.data?.message || 'Booking Failed';
      setError(message);
      if (err.response?.status === 409) {
        const slotsRes = await fetchDoctorSlots(id, { availableOnly: 'true' });
        setSlots(slotsRes.data);
        const stillAvailable = slotsRes.data.find(s => s.id === selectedSlot?.id);
        if (!stillAvailable) setSelectedSlot(null);
      }
    } finally {
      setBooking(false);
    }
  };

  const todayStr = getTodayStr();
  const todaySlots = slots.filter((slot) => {
    const d = new Date(slot.date);
    const slotDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return slotDate === todayStr;
  });
  const availableToday = todaySlots.length > 0;

  if (loading) return <Loader />;
  if (!doctor) return <p className="text-red-600 text-sm">{error || 'Doctor not found.'}</p>;

  return (
    <div className="space-y-6">

      {/* Doctor profile card */}
      <div className="card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="p-6 space-y-4">

          {/* Row 1 — Avatar + Name + Badge */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
              <span className="text-2xl font-bold text-white">
                {doctor.user?.name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dr. {doctor.user?.name}</h1>
                  <p className="text-blue-600 font-semibold mt-0.5">{doctor.speciality}</p>
                </div>
                <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                  availableToday
                    ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                    : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                }`}>
                  {availableToday ? 'Available Today' : 'No Slots Today'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2 — Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="border rounded-xl p-3">
              <p className="text-xs uppercase tracking-wider text-gray-500">Fees</p>
              <p className="text-lg font-bold mt-1">₹{doctor.fees}</p>
            </div>
            <div className="border rounded-xl p-3">
              <p className="text-xs uppercase tracking-wider text-gray-500">Timings</p>
              <p className="font-semibold mt-1 text-sm">{doctor.timings}</p>
            </div>
            <div className="border rounded-xl p-3">
              <p className="text-xs uppercase tracking-wider text-gray-500">Experience</p>
              <p className="font-semibold mt-1 text-sm">{doctor.experience} Years</p>
            </div>
            <div className="border rounded-xl p-3">
              <p className="text-xs uppercase tracking-wider text-gray-500">Contact</p>
              <div className="mt-1 space-y-0.5">
                {doctor.phone
                  ? <p className="text-sm font-semibold">{doctor.phone}</p>
                  : <p className="text-sm text-gray-400">—</p>
                }
                {doctor.receptionPhone && (
                  <p className="text-sm font-semibold">{doctor.receptionPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Row 3 — Address full width */}
          {doctor.clinicAddress && (
            <div className="border rounded-xl p-3">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Clinic Address</p>
              <p className="text-sm font-semibold">{doctor.clinicAddress}</p>
            </div>
          )}

        </div>
      </div>

      {/* Slots */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Available Slots</h2>
        {slots.length === 0 ? (
          <p className="text-gray-500 text-sm">No available slots at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                selected={selectedSlot?.id === slot.id}
                onSelect={setSelectedSlot}
              />
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Booking form */}
      {selectedSlot && (
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Book Appointment</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for visit</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Describe your symptoms or reason for visit..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="input-field"
            >
              {URGENCY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleBook} disabled={booking} className="btn-primary text-sm">
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button onClick={() => setSelectedSlot(null)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;