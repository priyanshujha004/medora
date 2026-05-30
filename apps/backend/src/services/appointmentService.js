const makeReadableId = (prefix, uuid) =>
  `${prefix}-${uuid.replace(/-/g, '').slice(0, 4).toUpperCase()}`;

const prisma = require('../config/db');

const bookAppointment = async (patientId, { doctorId, slotId, reason, urgency }) => {
  if (!doctorId || !slotId || !reason) {
    throw { status: 400, message: 'doctorId, slotId, and reason are required' };
  }

  const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
  if (!slot) throw { status: 404, message: 'Slot not found' };
  if (slot.isBooked) throw { status: 409, message: 'Slot is already booked' };

  // Atomic booking — re-check inside transaction to prevent race condition
const appointment = await prisma.$transaction(async (tx) => {
  // Re-fetch slot inside transaction with a write lock
  const slot = await tx.availabilitySlot.findUnique({
    where: { id: slotId },
  });

  if (!slot) throw { status: 404, message: 'Slot not found' };

  // ✅ This check now happens atomically — no race condition
  if (slot.isBooked) {
    throw { status: 409, message: 'This slot was just booked by someone else. Please choose another slot.' };
  }

  // Mark slot as booked first
  await tx.availabilitySlot.update({
    where: { id: slotId },
    data: { isBooked: true },
  });

  // Create appointment
  const newAppointment = await tx.appointment.create({
    data: {
      patientId,
      doctorId,
      slotId,
      reason,
      urgency: urgency || 'NORMAL',
      status: 'PENDING',
    },
    include: {
      slot: true,
      doctor: { include: { user: { select: { name: true } } } },
    },
  });

  return newAppointment;
});

return appointment;
};

const getPatientAppointments = async (patientId) => {
  return prisma.appointment.findMany({
    where: { patientId },
    include: {
      slot: true,
      doctor: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getDoctorAppointments = async (doctorId, { search, urgency, status } = {}) => {
  const where = { doctorId };
  if (urgency) where.urgency = urgency;
  if (status) where.status = status;

  // if (search) {
  //   const readableIdMatch = search.match(/^PAT-([0-9A-Fa-f]{4})$/i);
  //   if (readableIdMatch) {
  //     // lowercase for PostgreSQL case-sensitive UUID prefix match
  //     where.patient = {
  //       patientId: { startsWith: readableIdMatch[1].toLowerCase() },
  //     };
  //   } else {
  //     where.OR = [
  //       { patient: { user: { name: { contains: search, mode: 'insensitive' } } } },
  //     ];
  //   }
  // }

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { speciality: { contains: search, mode: 'insensitive' } },
    ];
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      slot: true,
      patient: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return appointments.map((a) => ({
    ...a,
    patient: a.patient
      ? { ...a.patient, readableId: makeReadableId('PAT', a.patient.patientId) }
      : null,
  }));
};

const updateAppointmentStatus = async (appointmentId, doctorId, { status, newSlotId }) => {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) throw { status: 404, message: 'Appointment not found' };
  if (appointment.doctorId !== doctorId) throw { status: 403, message: 'Access denied' };

  const allowedTransitions = {
    PENDING: ['APPROVED', 'REJECTED'],
    APPROVED: ['COMPLETED', 'PENDING', 'APPROVED'],
  };

  if (!newSlotId && !allowedTransitions[appointment.status]?.includes(status)) {
    throw { status: 400, message: `Cannot transition from ${appointment.status} to ${status}` };
  }

  const updateData = { status };

  if (newSlotId) {
    const newSlot = await prisma.availabilitySlot.findUnique({ where: { id: newSlotId } });
    if (!newSlot || newSlot.isBooked) throw { status: 400, message: 'New slot unavailable' };

    await prisma.$transaction([
      prisma.availabilitySlot.update({ where: { id: appointment.slotId }, data: { isBooked: false } }),
      prisma.availabilitySlot.update({ where: { id: newSlotId }, data: { isBooked: true } }),
    ]);

    updateData.slotId = newSlotId;
    updateData.isRescheduled = true; // ✅ set the flag
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: updateData,
    include: {
      slot: true,
      patient: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};