import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  const homeLink = user
    ? user.role === 'DOCTOR'
      ? '/doctor/dashboard'
      : '/patient/dashboard'
    : '/login';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={homeLink} className="text-xl font-bold text-primary-600 tracking-tight">
          Medora
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.name}
              </span>
              <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                {user.role}
              </span>
              <button onClick={logout} className="btn-secondary text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;