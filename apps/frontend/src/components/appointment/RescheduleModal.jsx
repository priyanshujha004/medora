// apps/frontend/src/components/appointment/RescheduleModal.jsx
import { useState, useEffect } from "react";
import { fetchDoctorSlots } from "../../services/slotService";
import { updateAppointmentStatus } from "../../services/appointmentService";
import useAuth from "../../hooks/useAuth";

const RescheduleModal = ({ appointment, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset state every time modal opens for any appointment
    setSlots([]);
    setSelectedSlotId("");
    setError("");
    setFetching(true);

    const fetchSlots = async () => {
      try {
        const { data } = await fetchDoctorSlots(
          user.doctorProfile.doctorId,
          { availableOnly: 'true' }
        );
        // Also include the current slot of THIS appointment so doctor can keep it
        const currentSlotId = appointment.slot?.id;
        const currentSlot = appointment.slot;

        // If current slot not in available list, prepend it manually
        const alreadyIncluded = data.some((s) => s.id === currentSlotId);
        const finalSlots = currentSlot && !alreadyIncluded
          ? [{ ...currentSlot, isBooked: true }, ...data]
          : data;

        setSlots(finalSlots);
      } catch {
        setError("Failed to load available slots.");
      } finally {
        setFetching(false);
      }
    };

    fetchSlots();
  }, [appointment.id]); // ✅ depend on appointment.id — re-runs for every unique appointment

  const handleConfirm = async () => {
    if (!selectedSlotId) {
      setError("Please select a slot.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await updateAppointmentStatus(appointment.id, {
        status: "APPROVED",
        newSlotId: selectedSlotId,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Reschedule failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Reschedule Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5 text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Patient:</span>{" "}
            {appointment.patient?.user?.name || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-700">Issue:</span>{" "}
            {appointment.reason || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-700">Current slot:</span>{" "}
            {appointment.slot
              ? `${appointment.slot.date} — ${appointment.slot.startTime} to ${appointment.slot.endTime}`
              : "—"}
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select new slot
          </label>

          {fetching ? (
            <p className="text-sm text-gray-400">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-red-400">
              No available slots. Add slots from Manage Slots first.
            </p>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {slots.map((slot) => (
                <label
                  key={slot.id}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition ${
                    selectedSlotId === slot.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    checked={selectedSlotId === slot.id}
                    onChange={() => setSelectedSlotId(slot.id)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    {slot.date} &mdash; {slot.startTime} to {slot.endTime}
                    {slot.isBooked && (
                      <span className="ml-2 text-xs text-orange-500">(current)</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading || fetching || !selectedSlotId}
            className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Rescheduling..." : "Confirm Reschedule"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default RescheduleModal;