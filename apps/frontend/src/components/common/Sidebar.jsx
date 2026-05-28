import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const patientLinks = [
  { to: '/patient/dashboard', label: 'Dashboard' },
  { to: '/patient/doctors', label: 'Find Doctors' },
  { to: '/patient/appointments', label: 'My Appointments' },
  { to: '/patient/profile', label: 'Profile' },
];

const doctorLinks = [
  { to: '/doctor/dashboard', label: 'Dashboard' },
  { to: '/doctor/slots', label: 'Manage Slots' },
  { to: '/doctor/appointments', label: 'Appointments' },
  { to: '/doctor/profile', label: 'Profile' },
];

const Sidebar = () => {
  const { user } = useAuth();
  const links = user?.role === 'DOCTOR' ? doctorLinks : patientLinks;

  return (
    <aside className="w-56 shrink-0 hidden md:block">
      <nav className="card p-3 sticky top-20">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
