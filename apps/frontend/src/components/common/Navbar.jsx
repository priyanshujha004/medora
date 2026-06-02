import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group">

          <span className="text-3xl font-extrabold tracking-tight text-blue-600">
            Medora
          </span>
        </Link>

        {/* Landing Page Navigation */}
        {!user && (
          <nav className="hidden lg:flex items-center gap-8">
            {location.pathname === '/' ? (
              <>
                <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">About</a>
                <a href="#patients" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">Patients</a>
                <a href="#doctors" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">Doctors</a>
                <a href="#preview" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">Gallery</a>
                <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">Testimonials</a>
              </>
            ) : (
              (location.pathname === '/login' || location.pathname === '/register') && (
                <>
                  <a href="/#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">About</a>
                  <a href="/#patients" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">Patients</a>
                  <a href="/#doctors" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">Doctors</a>
                  <a href="/#preview" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">Gallery</a>
                  <a href="/#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">Testimonials</a>
                </>
              )
            )}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              <Link
                to={
                  user.role === 'DOCTOR'
                    ? '/doctor/dashboard'
                    : '/patient/dashboard'
                }
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1"
              >
                Dashboard
              </Link>

              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-100">
                {user.role}
              </span>

              <button
                onClick={logout}
                className="btn-secondary text-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;