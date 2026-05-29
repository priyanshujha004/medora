import { useState, useEffect } from 'react';
import SearchBar from '../common/SearchBar';
import { SPECIALITIES as BASE_SPECIALITIES } from '../../utils/constants';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';

const DoctorFilters = ({
  search, onSearch,
  speciality, onSpeciality,
  sortFees, onSortFees,
}) => {
  const [specialities, setSpecialities] = useState(BASE_SPECIALITIES);

  useEffect(() => {
    api.get(ENDPOINTS.SPECIALITIES)
      .then((res) => {
        // Merge DB specialities with base list, deduplicate, sort
        const merged = Array.from(
          new Set([...BASE_SPECIALITIES, ...res.data])
        ).sort();
        setSpecialities(merged);
      })
      .catch(() => {
        // Fallback to static list if fetch fails
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
      <select
        value={speciality}
        onChange={(e) => onSpeciality(e.target.value)}
        className="input-field sm:w-48"
      >
        <option value="">All Specialities</option>
        {specialities.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={sortFees}
        onChange={(e) => onSortFees(e.target.value)}
        className="input-field sm:w-44"
      >
        <option value="">Sort by Fees</option>
        <option value="asc">Fees: Low to High</option>
        <option value="desc">Fees: High to Low</option>
      </select>
    </div>
  );
};

export default DoctorFilters;