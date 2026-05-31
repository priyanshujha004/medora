const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };
  
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol
  const isValidPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);
  };
  
  // 10-digit phone — strips spaces, dashes, +91 prefix
  const isValidPhone = (phone) => {
    const digits = String(phone).replace(/[\s\-\+]/g, '').replace(/^91/, '');
    return /^\d{10}$/.test(digits);
  };
  
  module.exports = { isValidEmail, isValidPassword, isValidPhone };