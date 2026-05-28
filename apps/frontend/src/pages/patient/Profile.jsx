import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const profile = user?.patientProfile;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-700">{user?.name?.[0]}</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
              PATIENT
            </span>
          </div>
        </div>

        {profile && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              ['Age', `${profile.age} years`],
              ['Blood Group', profile.bloodGroup],
              ['Phone', profile.contactInfo],
              ['Address', profile.address],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">{label}</dt>
                <dd className="font-medium text-gray-800">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
};

export default Profile;
