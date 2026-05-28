import { useEffect, useState } from 'react';
import { fetchDoctorSlots, createSlot, deleteSlot } from '../../services/slotService';
import SlotCard from '../../components/doctor/SlotCard';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';

const ManageSlots = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    fetchDoctorSlots(user.doctorProfile.doctorId)
      .then((res) => setSlots(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await createSlot(form);
      setForm({ date: '', startTime: '', endTime: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create slot');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Slots</h1>
        <p className="text-gray-500 text-sm mt-1">Create and manage your availability slots.</p>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Add New Slot</h2>
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
              className="input-field"
            />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" disabled={creating} className="btn-primary text-sm">
              {creating ? 'Creating...' : 'Add Slot'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-semibold text-gray-800 mb-3">All Slots ({slots.length})</h2>
        {loading ? (
          <Loader />
        ) : slots.length === 0 ? (
          <p className="text-gray-500 text-sm">No slots created yet.</p>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                showDelete
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSlots;
