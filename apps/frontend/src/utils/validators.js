export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };
  
  export const isValidPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);
  };
  
  export const getPasswordError = (password) => {
    if (!password || password.length < 8)
      return 'Password must be at least 8 characters';
  
    if (!/[A-Z]/.test(password))
      return 'Must contain at least one uppercase letter';
  
    if (!/[a-z]/.test(password))
      return 'Must contain at least one lowercase letter';
  
    if (!/\d/.test(password))
      return 'Must contain at least one digit';
  
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      return 'Must contain at least one symbol';
  
    return null;
  };
  
  export const isValidPhone = (phone) => {
    const digits = String(phone)
      .replace(/[\s\-\+]/g, '')
      .replace(/^91/, '');
  
    return /^\d{10}$/.test(digits);
  };
  
  export const getPasswordStrength = (password) => {
    if (!password) return 0;
  
    let score = 0;
  
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  
    return score;
  };