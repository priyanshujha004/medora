const Footer = () => {
    return (
      <footer className="bg-blue-600 border-t border-blue-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
  
            {/* Brand */}
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white">
                Medora
              </p>
              <p className="text-xs text-blue-100 mt-0.5">
                Healthcare Appointment Platform
              </p>
            </div>
  
            {/* Copyright */}
            <p className="text-xs text-blue-100 text-center">
              © 2026 Priyanshu Jha. All rights reserved.
            </p>
  
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;