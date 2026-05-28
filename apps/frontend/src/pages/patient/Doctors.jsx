import { useEffect, useState } from 'react';
import { fetchDoctors } from '../../services/doctorService';
import DoctorCard from '../../components/doctor/DoctorCard';
import DoctorFilters from '../../components/doctor/DoctorFilters';
import Loader from '../../components/common/Loader';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [speciality, setSpeciality] = useState('');

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (speciality) params.speciality = speciality;

    setLoading(true);
    fetchDoctors(params)
      .then((res) => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, speciality]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="text-gray-500 text-sm mt-1">Browse and book from available doctors.</p>
      </div>

      <DoctorFilters
        search={search}
        onSearch={setSearch}
        speciality={speciality}
        onSpeciality={setSpeciality}
      />

      {loading ? (
        <Loader />
      ) : doctors.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-12">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <DoctorCard key={doc.doctorId} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
