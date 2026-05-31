import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDoctorById } from '../../services/doctorService';
import { fetchDoctorSlots } from '../../services/slotService';
import { bookAppointment } from '../../services/appointmentService';
import Loader from '../../components/common/Loader';
import SlotCard from '../../components/doctor/SlotCard';
import { URGENCY_OPTIONS } from '../../utils/constants';

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
      setError('Please select a slot and provide a reason.');
      return;
    }
    setError('');
    setBooking(true);
    try {
      await bookAppointment({ doctorId: id, slotId: selectedSlot.id, reason, urgency });
      navigate('/patient/appointments');
    } catch (err) {
      const message = err.response?.data?.message || 'Booking failed';
      setError(message);
      if (err.response?.status === 409) {
        // Refresh slots — the taken slot will disappear
        const slotsRes = await fetchDoctorSlots(id, { availableOnly: 'true' });
        setSlots(slotsRes.data);
        // Deselect only if the selected slot is no longer available
        const stillAvailable = slotsRes.data.find(s => s.id === selectedSlot?.id);
        if (!stillAvailable) setSelectedSlot(null);
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Loader />;
  if (!doctor) return <p className="text-red-600 text-sm">{error || 'Doctor not found.'}</p>;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary-700">{doctor.user?.name?.[0]}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{doctor.user?.name}</h1>
            <p className="text-primary-600 font-medium">{doctor.speciality}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span>{doctor.experience} years exp.</span>
              <span>₹{doctor.fees} fee</span>
              <span>{doctor.timings}</span>
              <span>{doctor.clinicAddress}</span>
              {doctor.phone && (
                <span>📞 {doctor.phone}</span>
              )}
              {doctor.receptionPhone && (
                <span>📞 Reception: {doctor.receptionPhone}</span>
              )}
            </div>
          </div>
        </div>
      </div>

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

      {/* ✅ Error shown outside booking block — visible even after slot deselected */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

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
