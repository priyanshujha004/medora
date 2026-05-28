import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { updateDoctorProfile } from "../../services/doctorService";

const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    speciality:   user?.doctorProfile?.speciality   || "",
    clinicAddress: user?.doctorProfile?.clinicAddress || "",
    experience:   user?.doctorProfile?.experience   || "",
    fees:         user?.doctorProfile?.fees         || "",
    age:          user?.doctorProfile?.age          || "",
    timings:      user?.doctorProfile?.timings      || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await updateDoctorProfile(form);
      await refreshUser();
      setEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      speciality:   user?.doctorProfile?.speciality   || "",
      clinicAddress: user?.doctorProfile?.clinicAddress || "",
      experience:   user?.doctorProfile?.experience   || "",
      fees:         user?.doctorProfile?.fees         || "",
      age:          user?.doctorProfile?.age          || "",
      timings:      user?.doctorProfile?.timings      || "",
    });
    setEditing(false);
  };

  const fields = [
    { label: "Speciality",          name: "speciality",   type: "text"   },
    { label: "Clinic Address",      name: "clinicAddress", type: "text"   },
    { label: "Experience (years)",  name: "experience",   type: "number" },
    { label: "Consultation Fee (₹)", name: "fees",        type: "number" },
    { label: "Age",                 name: "age",          type: "number" },
    { label: "Timings",             name: "timings",      type: "text"   },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Profile</h1>

      {/* Identity — read-only */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 text-sm px-1">
                {user?.doctorProfile?.[name] || "—"}
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
                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Saving..." : "Save Changes"}
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
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
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