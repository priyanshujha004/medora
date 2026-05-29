import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { updatePatientProfile } from '../../services/authService';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const profile = user?.patientProfile;

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    age:         profile?.age         || '',
    contactInfo: profile?.contactInfo || '',
    bloodGroup:  profile?.bloodGroup  || '',
    address:     profile?.address     || '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        age:         profile.age         || '',
        contactInfo: profile.contactInfo || '',
        bloodGroup:  profile.bloodGroup  || '',
        address:     profile.address     || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await updatePatientProfile(form);
      await refreshUser();
      setEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      age:         profile?.age         || '',
      contactInfo: profile?.contactInfo || '',
      bloodGroup:  profile?.bloodGroup  || '',
      address:     profile?.address     || '',
    });
    setError('');
    setEditing(false);
  };

  const fields = [
    { label: 'Age',         name: 'age',         type: 'number' },
    { label: 'Blood Group', name: 'bloodGroup',  type: 'text'   },
    { label: 'Phone',       name: 'contactInfo', type: 'text'   },
    { label: 'Address',     name: 'address',     type: 'text'   },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      {/* Identity card */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-600">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                PATIENT
              </span>
              {profile?.readableId && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                  {profile.readableId}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
        )}

        {fields.map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {label}
            </label>
            {editing ? (
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-gray-800 text-sm px-1">
                {name === 'age' && profile?.age
                  ? `${profile.age} years`
                  : profile?.[name] || '—'}
              </p>
            )}
          </div>
        ))}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-5 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;