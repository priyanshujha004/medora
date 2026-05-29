import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import { SPECIALITIES } from '../../utils/constants';

const PATIENT_FIELDS = [
  { name: 'age', label: 'Age', type: 'number', placeholder: '25' },
  { name: 'contactInfo', label: 'Phone', type: 'text', placeholder: '+91 98765 43210' },
  { name: 'bloodGroup', label: 'Blood Group', type: 'text', placeholder: 'B+' },
  { name: 'address', label: 'Address', type: 'text', placeholder: '45 Green Park, Delhi' },
];

const DOCTOR_FIELDS = [
  { name: 'age', label: 'Age', type: 'number', placeholder: '35' },
  { name: 'experience', label: 'Experience (years)', type: 'number', placeholder: '10' },
  { name: 'clinicAddress', label: 'Clinic Address', type: 'text', placeholder: '12 Wellness Ave' },
  { name: 'fees', label: 'Consultation Fee (₹)', type: 'number', placeholder: '500' },
  { name: 'timings', label: 'Timings', type: 'text', placeholder: 'Mon-Fri 9am-5pm' },
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'PATIENT' });
  const [profile, setProfile] = useState({});
  const [specialityChoice, setSpecialityChoice] = useState('');
  const [customSpeciality, setCustomSpeciality] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleProfile = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Resolve final speciality value
    const finalProfile = { ...profile };
    if (form.role === 'DOCTOR') {
      const resolvedSpeciality = specialityChoice === 'Other'
        ? customSpeciality.trim()
        : specialityChoice;
      if (!resolvedSpeciality) {
        setError('Please select or enter a speciality.');
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
      setError(err.response?.data?.message || 'Registration failed');
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
            <input name="name" type="text" value={form.name} onChange={handleChange} required className="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="input-field" placeholder="At least 6 characters" />
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
                    className="text-primary-600"
                  />
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
                    className="input-field"
                  >
                    <option value="">Select speciality...</option>
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
                      placeholder="Enter your speciality..."
                      className="input-field mt-2"
                      required
                    />
                  )}
                </div>
              )}

              {/* All other profile fields */}
              {profileFields.map((f) => (
                <div
                  key={f.name}
                  className={
                    f.name === 'address' || f.name === 'clinicAddress' || f.name === 'timings'
                      ? 'col-span-2'
                      : ''
                  }
                >
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    value={profile[f.name] || ''}
                    onChange={handleProfile}
                    required
                    className="input-field"
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create account'}
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