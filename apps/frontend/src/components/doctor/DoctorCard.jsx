import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const { doctorId, speciality, experience, fees, timings, user } = doctor;

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <span className="text-primary-700 font-semibold text-lg">
            {user?.name?.[0] || 'D'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
          <p className="text-sm text-primary-600 font-medium">{speciality}</p>
        </div>
      </div>

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
