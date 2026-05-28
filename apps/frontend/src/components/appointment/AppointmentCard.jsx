import { formatDate } from '../../utils/formatDate';

const urgencyClass = { NORMAL: 'badge-normal', URGENT: 'badge-urgent', IMPORTANT: 'badge-important' };
const statusClass = {
  PENDING: 'status-pending',
  APPROVED: 'status-approved',
  REJECTED: 'status-rejected',
  COMPLETED: 'status-completed',
};

const AppointmentCard = ({ appointment, role, onStatusChange }) => {
  const { id, reason, urgency, status, slot, doctor, patient, createdAt } = appointment;

  const name = role === 'PATIENT' ? doctor?.user?.name : patient?.user?.name;
  const label = role === 'PATIENT' ? 'Dr.' : 'Patient';

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-semibold text-gray-900">
            {label} {name}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{reason}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className={urgencyClass[urgency] || 'badge-normal'}>{urgency}</span>
          <span className={statusClass[status] || 'status-pending'}>{status}</span>
        </div>
      </div>

      {slot && (
        <p className="text-xs text-gray-500 mt-2">
          {formatDate(slot.date)} &bull; {slot.startTime}–{slot.endTime}
        </p>
      )}

      {role === 'DOCTOR' && status === 'PENDING' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onStatusChange(id, 'APPROVED')}
            className="btn-primary text-xs px-3 py-1.5"
          >
            Approve
          </button>
          <button
            onClick={() => onStatusChange(id, 'REJECTED')}
            className="btn-danger text-xs px-3 py-1.5"
          >
            Reject
          </button>
        </div>
      )}

      {role === 'DOCTOR' && status === 'APPROVED' && (
        <button
          onClick={() => onStatusChange(id, 'COMPLETED')}
          className="btn-secondary text-xs px-3 py-1.5 mt-3"
        >
          Mark Completed
        </button>
      )}
    </div>
  );
};

export default AppointmentCard;
