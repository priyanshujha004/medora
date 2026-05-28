const TABS = ['All', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'];

const AppointmentTabs = ({ active, onChange }) => {
  return (
    <div className="flex gap-1 border-b border-gray-200 overflow-x-auto pb-px">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab === 'All' ? '' : tab)}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            (active === '' && tab === 'All') || active === tab
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default AppointmentTabs;
