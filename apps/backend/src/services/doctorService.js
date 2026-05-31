const makeReadableId = (uuid) =>
  `DOC-${uuid.replace(/-/g, '').slice(0, 4).toUpperCase()}`;

const prisma = require('../config/db');

const getAllDoctors = async ({ search, speciality, sortFees }) => {
  const where = {};

  // if (search) {
  //   const readableIdMatch = search.match(/^DOC-([0-9A-Fa-f]{4})$/i);
  //   if (readableIdMatch) {
  //     where.doctorId = { startsWith: readableIdMatch[1].toLowerCase() };
  //   } else {
  //     where.OR = [
  //       { user: { name: { contains: search, mode: 'insensitive' } } },
  //       { speciality: { contains: search, mode: 'insensitive' } },
  //     ];
  //   }
  // }
  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { speciality: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (speciality) {
    where.speciality = { contains: speciality, mode: 'insensitive' };
  }

  // Build orderBy — fees sort takes priority if selected, else sort by name
  const orderBy = sortFees
    ? { fees: sortFees }           // 'asc' or 'desc'
    : { user: { name: 'asc' } };  // default alphabetical

  const doctors = await prisma.doctorProfile.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy,
  });

  return doctors.map((d) => ({
    ...d,
    readableId: makeReadableId(d.doctorId),
  }));
};

const getDoctorById = async (doctorId) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { doctorId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!doctor) throw { status: 404, message: 'Doctor not found' };
  return { ...doctor, readableId: makeReadableId(doctor.doctorId) };
};

const updateDoctorProfile = async (doctorId, data) => {
  const { age, experience, speciality, clinicAddress, fees, timings, phone, receptionPhone } = data;
  const updated = await prisma.doctorProfile.update({
  where: { doctorId },
  data: {
    ...(age && { age: parseInt(age) }),
    ...(experience && { experience: parseInt(experience) }),
    ...(speciality && { speciality }),
    ...(clinicAddress && { clinicAddress }),
    ...(fees && { fees: parseFloat(fees) }),
    ...(timings && { timings }),
    ...(phone !== undefined && { phone }),
    ...(receptionPhone !== undefined && { receptionPhone }),
  },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  return { ...updated, readableId: makeReadableId(updated.doctorId) };
};
const getSpecialities = async () => {
  const doctors = await prisma.doctorProfile.findMany({
    select: { speciality: true },
    distinct: ['speciality'],
    orderBy: { speciality: 'asc' },
  });
  return doctors.map((d) => d.speciality).filter(Boolean);
};

module.exports = { getAllDoctors, getDoctorById, updateDoctorProfile, getSpecialities };