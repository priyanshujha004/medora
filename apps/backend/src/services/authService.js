const makeReadableId = (prefix, uuid) =>
  `${prefix}-${uuid.replace(/-/g, '').slice(0, 4).toUpperCase()}`;
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const generateToken = require('../utils/generateToken');
const { isValidEmail, isValidPassword, isValidPhone } = require('../utils/validators');

const register = async ({ name, email, password, role, profile }) => {
  if (!name || !email || !password || !role) {
    throw { status: 400, message: 'Name, email, password, and role are required' };
  }
  if (!isValidEmail(email)) {
    throw { status: 400, message: 'Invalid Email Format' };
  }
  // ✅ Updated — 8 chars, uppercase, lowercase, digit, symbol
  if (!isValidPassword(password)) {
    throw { status: 400, message: 'Password must be at least 8 characters and include uppercase, lowercase, a digit, and a symbol' };
  }
  if (!['PATIENT', 'DOCTOR'].includes(role)) {
    throw { status: 400, message: 'Role must be PATIENT or DOCTOR' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  // ✅ Specific message for duplicate email
  if (existing) throw { status: 409, message: 'An account with this email already exists. Please sign in instead.' };

  const hashed = await bcrypt.hash(password, 10);
  const data = { name, email, password: hashed, role };

  if (role === 'PATIENT') {
    const { age, contactInfo, bloodGroup, address } = profile || {};
    if (!age || !contactInfo || !bloodGroup || !address) {
      throw { status: 400, message: 'Patient profile fields are required' };
    }
    // ✅ Phone validation
    if (!isValidPhone(contactInfo)) {
      throw { status: 400, message: 'Phone number must be 10 digits' };
    }
    data.patientProfile = {
      create: { age: parseInt(age), contactInfo, bloodGroup, address },
    };
  }

  if (role === 'DOCTOR') {
    const { age, experience, speciality, clinicAddress, fees, timings, phone, receptionPhone } = profile || {};
          if (!age || !experience || !speciality || !clinicAddress || !fees || !timings) {
              throw { status: 400, message: 'Doctor profile fields are required' };
          }
          if (phone && !isValidPhone(phone)) {
            throw {
              status: 400,
              message: 'Invalid Phone Number'
            };
          }
          
          if (
            receptionPhone &&
            !isValidPhone(receptionPhone)
          ) {
            throw {
              status: 400,
              message:
                'Invalid Phone Number'
            };
          }
    data.doctorProfile = {
      create: {
        age: parseInt(age),
        experience: parseInt(experience),
        speciality,
        clinicAddress,
        fees: parseFloat(fees),
        timings,
        ...(phone && { phone }),
        ...(receptionPhone && { receptionPhone }),
      },
    };
  }

  const user = await prisma.user.create({ data });
  const token = generateToken({ id: user.id, role: user.role });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email and Password are required' };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // ✅ Specific messages — safe since we're not revealing whether email exists via brute force
  // (attacker would need to know valid email first, which login form validates format anyway)
  if (!user) throw { status: 401, message: 'Invalid Login Credentials' };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw { status: 401, message: 'Invalid Login Credentials' };

  const token = generateToken({ id: user.id, role: user.role });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { patientProfile: true, doctorProfile: true },
  });
  if (!user) throw { status: 404, message: 'User not found' };
  const { password, ...rest } = user;

  if (rest.role === 'PATIENT' && rest.patientProfile) {
    rest.patientProfile.readableId = makeReadableId('PAT', rest.id);
  }
  if (rest.role === 'DOCTOR' && rest.doctorProfile) {
    rest.doctorProfile.readableId = makeReadableId('DOC', rest.id);
  }

  return rest;
};

const updatePatientProfile = async (userId, data) => {
  const { age, contactInfo, bloodGroup, address } = data;
  // ✅ Validate phone on update too
  if (contactInfo && !isValidPhone(contactInfo)) {
    throw { status: 400, message: 'Phone number must be 10 digits' };
  }
  const updated = await prisma.patientProfile.update({
    where: { patientId: userId },
    data: {
      ...(age && { age: parseInt(age) }),
      ...(contactInfo && { contactInfo }),
      ...(bloodGroup && { bloodGroup }),
      ...(address && { address }),
    },
  });
  return updated;
};

module.exports = { register, login, getMe, updatePatientProfile };