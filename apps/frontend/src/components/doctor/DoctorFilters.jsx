import SearchBar from '../common/SearchBar';

const SPECIALITIES = [
  'All',
  'Cardiology',
  'Dermatology',
  'General Medicine',
  'Neurology',
  'Orthopaedics',
  'Paediatrics',
  'Psychiatry',
  'Gynaecology',
];

const DoctorFilters = ({ search, onSearch, speciality, onSpeciality }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <SearchBar value={search} onChange={onSearch} placeholder="Search by name or speciality..." />
      </div>
      <select
        value={speciality}
        onChange={(e) => onSpeciality(e.target.value === 'All' ? '' : e.target.value)}
        className="input-field sm:w-48"
      >
        {SPECIALITIES.map((s) => (
          <option key={s} value={s === 'All' ? '' : s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DoctorFilters;
