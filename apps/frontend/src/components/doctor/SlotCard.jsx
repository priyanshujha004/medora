import { formatDate } from '../../utils/formatDate';

const SlotCard = ({ slot, onSelect, selected, onDelete, showDelete = false }) => {
  const isAvailable = !slot.isBooked;

  return (
    <div
      onClick={() => onSelect && isAvailable && onSelect(slot)}
      className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
        selected
          ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
          : isAvailable && onSelect
          ? 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 cursor-pointer'
          : showDelete
          ? 'border-gray-200'
          : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-800">{formatDate(slot.date)}</p>
          <p className="text-gray-500 mt-0.5">
            {slot.startTime} – {slot.endTime}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {isAvailable ? 'Available' : 'Booked'}
          </span>
          {showDelete && !slot.isBooked && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(slot.id); }}
              className="text-red-500 hover:text-red-700 text-xs underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotCard;