import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctorSlots } from '../../services/slotService';

const getTodayStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const DoctorCard = ({ doctor }) => {
  const { doctorId, speciality, experience, fees, timings, clinicAddress, phone, receptionPhone, user, readableId } = doctor;
  const [availableToday, setAvailableToday] = useState(null);

  useEffect(() => {
    fetchDoctorSlots(doctorId, { availableOnly: 'true' })
      .then((res) => {
        const today = getTodayStr();
        const hasToday = res.data.some((slot) => {
          const d = new Date(slot.date);
          const slotDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return slotDate === today;
        });
        setAvailableToday(hasToday);
      })
      .catch(() => setAvailableToday(false));
  }, [doctorId]);

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">

      {/* Header — same structure, blinking dot added top-right */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-primary-700 font-semibold text-lg">
              {user?.name?.[0] || 'D'}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">Dr. {user?.name}</h3>
            <p className="text-sm text-primary-600 font-medium">{speciality}</p>
            {readableId && (
              <span className="text-xs font-mono text-gray-400">{readableId}</span>
            )}
          </div>
        </div>

        {/* Blinking availability dot */}
        {availableToday !== null && (
  <div className="shrink-0 pt-1">
    <span className={`relative flex h-3 w-3`}>
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${
        availableToday ? 'bg-green-400' : 'bg-red-400'
      }`}
        style={{ animationDuration: '2s' }}
      />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${
        availableToday
          ? 'bg-gradient-to-br from-emerald-400 to-green-500'
          : 'bg-gradient-to-br from-red-400 to-rose-500'
      }`} />
    </span>
  </div>
)}
      </div>

      {/* Details — same structure as before, contacts added */}
      <div className="mt-4 space-y-1.5 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Experience</span>
          <span className="font-medium text-gray-800">{experience} yrs</span>
        </div>
        <div className="flex justify-between">
          <span>Consultation Fee</span>
          <span className="font-medium text-gray-800">₹{fees}</span>
        </div>
        <div className="flex justify-between">
          <span>Timings</span>
          <span className="font-medium text-gray-800 text-right max-w-[120px] truncate">{timings}</span>
        </div>
        {phone && (
          <div className="flex justify-between">
            <span>Contact</span>
            <span className="font-medium text-gray-800">{phone}</span>
          </div>
        )}
        {receptionPhone && (
          <div className="flex justify-between">
            <span>Reception</span>
            <span className="font-medium text-gray-800">{receptionPhone}</span>
          </div>
        )}
      </div>

      <Link
        to={`/patient/doctors/${doctorId}`}
        className="btn-primary mt-4 w-full text-center text-sm block"
      >
        View &amp; Book
      </Link>
    </div>
  );
};

export default DoctorCard;