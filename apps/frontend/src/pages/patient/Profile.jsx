import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const profile = user?.patientProfile;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      {/* Identity card — matches Doctor Profile style */}
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

      {/* Profile details card */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        {profile ? (
          <>
            {[
              { label: 'Age', value: profile.age ? `${profile.age} years` : '—' },
              { label: 'Blood Group', value: profile.bloodGroup || '—' },
              { label: 'Phone', value: profile.contactInfo || '—' },
              { label: 'Address', value: profile.address || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                <p className="text-gray-800 text-sm px-1">{value}</p>
              </div>
            ))}
          </>
        ) : (
          <p className="text-sm text-gray-500">Profile details not available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;