const DoctorModal = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{doctor.user?.name}</h2>
            <p className="text-primary-600 font-medium text-sm">{doctor.speciality}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <dl className="space-y-2 text-sm">
          {[
            ['Age', `${doctor.age} years`],
            ['Experience', `${doctor.experience} years`],
            ['Clinic Address', doctor.clinicAddress],
            ['Consultation Fee', `₹${doctor.fees}`],
            ['Timings', doctor.timings],
            ['Email', doctor.user?.email],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-gray-500 shrink-0">{label}</dt>
              <dd className="font-medium text-gray-800 text-right">{value}</dd>
            </div>
          ))}
        </dl>

        <button onClick={onClose} className="btn-secondary mt-6 w-full text-sm">
          Close
        </button>
      </div>
    </div>
  );
};

export default DoctorModal;
