const prisma = require('../config/db');

const getAllDoctors = async ({ search, speciality }) => {
  const where = {};

  if (search || speciality) {
    where.OR = [];
    if (search) {
      where.OR.push(
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { speciality: { contains: search, mode: 'insensitive' } }
      );
    }
    if (speciality) {
      where.speciality = { contains: speciality, mode: 'insensitive' };
      delete where.OR;
    }
  }

  const doctors = await prisma.doctorProfile.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { user: { name: 'asc' } },
  });

  return doctors;
};

const getDoctorById = async (doctorId) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { doctorId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!doctor) throw { status: 404, message: 'Doctor not found' };
  return doctor;
};

const updateDoctorProfile = async (doctorId, data) => {
  const { age, experience, speciality, clinicAddress, fees, timings } = data;
  const updated = await prisma.doctorProfile.update({
    where: { doctorId },
    data: {
      ...(age && { age: parseInt(age) }),
      ...(experience && { experience: parseInt(experience) }),
      ...(speciality && { speciality }),
      ...(clinicAddress && { clinicAddress }),
      ...(fees && { fees: parseFloat(fees) }),
      ...(timings && { timings }),
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  return updated;
};

module.exports = { getAllDoctors, getDoctorById, updateDoctorProfile };
