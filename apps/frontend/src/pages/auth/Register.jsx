import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import { SPECIALITIES } from '../../utils/constants';
import { isValidEmail, getPasswordError, isValidPhone } from '../../utils/validators';

const PATIENT_FIELDS = [
  { name: 'age', label: 'Age', type: 'number', placeholder: '21' },
  { name: 'contactInfo', label: 'Phone', type: 'text', placeholder: '+91 XXXXX XXXXX' },
  { name: 'bloodGroup', label: 'Blood Group', type: 'text', placeholder: 'AB+' },
  { name: 'address', label: 'Address', type: 'text', placeholder: 'New Delhi' },
];

const DOCTOR_FIELDS = [
  { name: 'age', label: 'Age', type: 'number', placeholder: '35' },
  { name: 'experience', label: 'Experience (years)', type: 'number', placeholder: '10' },
  { name: 'phone', label: 'Doctor\'s Contact Number', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
  { name: 'receptionPhone', label: 'Reception Contact', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
  { name: 'clinicAddress', label: 'Clinic Address', type: 'text', placeholder: 'New Delhi' },
  { name: 'fees', label: 'Consultation Fee (₹)', type: 'number', placeholder: '500' },
  { name: 'timings', label: 'Timings', type: 'text', placeholder: 'Mon-Fri 6-9 PM' },
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'PATIENT' });
  const [profile, setProfile] = useState({});
  const [specialityChoice, setSpecialityChoice] = useState('');
  const [customSpeciality, setCustomSpeciality] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword]=useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };
  const handleProfile = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};

    if (!isValidEmail(form.email)) {
      newErrors.email = 'Enter a valid Email ID';
    }
    const pwdError = getPasswordError(form.password);
    if (pwdError) {
      newErrors.password = pwdError;
    }
    if (form.role === 'PATIENT') {
      if (!profile.contactInfo) {
        newErrors.contactInfo = 'Phone Number is Required';
      }
      else if (!isValidPhone(profile.contactInfo)) {
        newErrors.contactInfo = 'Enter a Valid Phone Number';
      }
    }
    if (form.role === 'DOCTOR') {
      if (!profile.phone) {
        newErrors.phone = 'Phone Number is Required';
      }
      else if (!isValidPhone(profile.phone)) {
        newErrors.phone = 'Enter a Valid Phone Number';
      }
      if (
        profile.receptionPhone &&
        !isValidPhone(profile.receptionPhone)
      ) {
        newErrors.receptionPhone =
          'Enter a Valid Phone Number';
      }
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Resolve final speciality value
    const finalProfile = { ...profile };
    if (form.role === 'DOCTOR') {
      const resolvedSpeciality = specialityChoice === 'Other'
        ? customSpeciality.trim()
        : specialityChoice;
      if (!resolvedSpeciality) {
        setError('Please Select or Enter a Speciality.');
        setLoading(false);
        return;
      }
      finalProfile.speciality = resolvedSpeciality;
    }

    try {
      const res = await registerUser({ ...form, profile: finalProfile });
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  const profileFields = form.role === 'DOCTOR' ? DOCTOR_FIELDS : PATIENT_FIELDS;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="card max-w-lg w-full p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Medora today</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} required className="input-field" placeholder="Amit Singh" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className={`input-field ${fieldErrors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
            placeholder="example@gmail.com" />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              className={`input-field pr-12 ${
                fieldErrors.password
                  ? 'border-red-400 focus:ring-red-400' : '' }`} placeholder="Minimum 8 Characters"/>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 4.5 9 7s-1.52 3.84-3.2 5.06M6.71 6.72C4.23 8.18 3 10.1 3 12c0 2.5 4 7 9 7a9.7 9.7 0 004.29-.96"/>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z"/>
                </svg>
              )}
            </button>
          </div>

          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors.password}
            </p>
          )}
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
            <div className="flex gap-3">
              {['PATIENT', 'DOCTOR'].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={handleChange}
                    className="text-primary-600"/>
                  <span className="text-sm">{r === 'PATIENT' ? 'Patient' : 'Doctor'}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Profile Information</p>
            <div className="grid grid-cols-2 gap-3">

              {/* Speciality dropdown — only for doctors */}
              {form.role === 'DOCTOR' && (
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Speciality</label>
                  <select
                    value={specialityChoice}
                    onChange={(e) => setSpecialityChoice(e.target.value)}
                    required
                    className="input-field">
                    <option value="">Select Speciality...</option>
                    {SPECIALITIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="Other">Other (specify below)</option>
                  </select>
                  {/* Custom speciality input — shown only when Other is selected */}
                  {specialityChoice === 'Other' && (
                    <input
                      type="text"
                      value={customSpeciality}
                      onChange={(e) => setCustomSpeciality(e.target.value)}
                      placeholder="Enter your Speciality..."
                      className="input-field mt-2"
                      required/>
                  )}
                </div>
              )}

              {/* All other profile fields */}
              {profileFields.map((f) => (
              <div
                key={f.name}
                className={
                  f.name === 'address' || f.name === 'clinicAddress' ||
                  f.name === 'timings' || f.name === 'phone' || f.name === 'receptionPhone'
                    ? 'col-span-2'
                    : ''
              }>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={profile[f.name] || ''}
                onChange={(e) => {
                  handleProfile(e);
                  if (fieldErrors[e.target.name]) {
                    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
                  }
                }}
                required={f.name !== 'phone' && f.name !== 'receptionPhone'}
                className={`input-field ${fieldErrors[f.name] ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder={f.placeholder}
              />
              {fieldErrors[f.name] && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors[f.name]}</p>
              )}
              </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;