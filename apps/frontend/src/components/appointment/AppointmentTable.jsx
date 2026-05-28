import { formatDate, formatDateTime } from '../../utils/formatDate';

const urgencyClass = { NORMAL: 'badge-normal', URGENT: 'badge-urgent', IMPORTANT: 'badge-important' };
const statusClass = {
  PENDING: 'status-pending',
  APPROVED: 'status-approved',
  REJECTED: 'status-rejected',
  COMPLETED: 'status-completed',
};

const AppointmentTable = ({ appointments, role, onStatusChange, onReschedule }) => {
  if (!appointments.length) {
    return <p className="text-gray-500 text-sm text-center py-8">No appointments found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="pb-3 pr-4">{role === 'PATIENT' ? 'Doctor' : 'Patient'}</th>
            <th className="pb-3 pr-4">Slot</th>
            <th className="pb-3 pr-4">Reason</th>
            <th className="pb-3 pr-4">Urgency</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4">Booked On</th>
            {role === 'DOCTOR' && <th className="pb-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {appointments.map((appt) => {
            const name =
              role === 'PATIENT' ? appt.doctor?.user?.name : appt.patient?.user?.name;
            return (
              <tr key={appt.id} className="hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-900">{name}</td>
                <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                  {appt.slot ? (
                    <>
                      {formatDate(appt.slot.date)}
                      <br />
                      <span className="text-xs">
                        {appt.slot.startTime}–{appt.slot.endTime}
                      </span>
                    </>
                  ) : '—'}
                </td>
                <td className="py-3 pr-4 text-gray-600 max-w-[160px] truncate">{appt.reason}</td>
                <td className="py-3 pr-4">
                  <span className={urgencyClass[appt.urgency] || 'badge-normal'}>{appt.urgency}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className={statusClass[appt.status] || 'status-pending'}>{appt.status}</span>
                </td>
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap text-xs">
                  {formatDateTime(appt.createdAt)}
                </td>
                {role === 'DOCTOR' && (
                  <td className="py-3">
                    <div className="flex gap-1.5">
                      {appt.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => onStatusChange(appt.id, 'APPROVED')}
                            className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onStatusChange(appt.id, 'REJECTED')}
                            className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-medium"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => onReschedule(appt)}
                            className="px-3 py-1.5 text-xs font-medium border border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      {appt.status === 'APPROVED' && (
                        <button
                          onClick={() => onStatusChange(appt.id, 'COMPLETED')}
                          className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
