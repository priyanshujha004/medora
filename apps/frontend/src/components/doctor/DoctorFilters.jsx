import { useState, useEffect } from 'react';
import SearchBar from '../common/SearchBar';
import { SPECIALITIES as BASE_SPECIALITIES } from '../../utils/constants';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';

const Chevron = () => (
  <svg
    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-black-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const DoctorFilters = ({
  search,
  onSearch,
  speciality,
  onSpeciality,
  sortFees,
  onSortFees,
}) => {
  const [specialities, setSpecialities] = useState(BASE_SPECIALITIES);

  useEffect(() => {
    api
      .get(ENDPOINTS.SPECIALITIES)
      .then((res) => {
        const merged = Array.from(
          new Set([...BASE_SPECIALITIES, ...res.data])
        ).sort();

        setSpecialities(merged);
      })
      .catch(() => {
        setSpecialities(BASE_SPECIALITIES);
      });
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3">

      <div className="flex-1">
        <SearchBar
          value={search}
          onChange={onSearch}
          placeholder="Search by name, speciality..."
        />
      </div>

      {/* Speciality Dropdown */}
      <div className="relative z-10 sm:w-56">
        <select
          value={speciality}
          onChange={(e) => onSpeciality(e.target.value)}
          className="input-field appearance-none pr-12"
        >
          <option value="">All Specialities</option>

          {specialities.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <Chevron />
      </div>

      {/* Fees Dropdown */}
      <div className="relative z-10 sm:w-52">
        <select
          value={sortFees}
          onChange={(e) => onSortFees(e.target.value)}
          className="input-field appearance-none pr-12"
        >
          <option value="">Sort by Fees</option>
          <option value="asc">Fees: Low to High</option>
          <option value="desc">Fees: High to Low</option>
        </select>

        <Chevron />
      </div>

    </div>
  );
};

export default DoctorFilters;