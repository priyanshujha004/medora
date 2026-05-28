const prisma = require('../config/db');

const bookAppointment = async (patientId, { doctorId, slotId, reason, urgency }) => {
  if (!doctorId || !slotId || !reason) {
    throw { status: 400, message: 'doctorId, slotId, and reason are required' };
  }

  const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
  if (!slot) throw { status: 404, message: 'Slot not found' };
  if (slot.isBooked) throw { status: 409, message: 'Slot is already booked' };

  const [appointment] = await prisma.$transaction([
    prisma.appointment.create({
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
    }),
    prisma.availabilitySlot.update({ where: { id: slotId }, data: { isBooked: true } }),
  ]);

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
  if (search) {
    where.patient = {
      user: { name: { contains: search, mode: 'insensitive' } },
    };
  }

  return prisma.appointment.findMany({
    where,
    include: {
      slot: true,
      patient: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const updateAppointmentStatus = async (appointmentId, doctorId, { status, newSlotId }) => {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) throw { status: 404, message: 'Appointment not found' };
  if (appointment.doctorId !== doctorId) throw { status: 403, message: 'Access denied' };

  const allowedTransitions = {
    PENDING: ['APPROVED', 'REJECTED'],
    APPROVED: ['COMPLETED', 'PENDING', 'APPROVED'],
  };
  
  // When rescheduling, skip transition check — slot swap is the operation
  if (!newSlotId && !allowedTransitions[appointment.status]?.includes(status)) {
    throw { status: 400, message: `Cannot transition from ${appointment.status} to ${status}` };
  }

  const updateData = { status };

  if (newSlotId) {
    // Reschedule — swap slots regardless of target status
    const newSlot = await prisma.availabilitySlot.findUnique({ where: { id: newSlotId } });
    if (!newSlot || newSlot.isBooked) throw { status: 400, message: 'New slot unavailable' };
  
    await prisma.$transaction([
      // Free the previously booked slot
      prisma.availabilitySlot.update({ where: { id: appointment.slotId }, data: { isBooked: false } }),
      // Mark new slot as booked
      prisma.availabilitySlot.update({ where: { id: newSlotId }, data: { isBooked: true } }),
    ]);
    updateData.slotId = newSlotId;
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: updateData,
    include: { slot: true },
  });
};

module.exports = { bookAppointment, getPatientAppointments, getDoctorAppointments, updateAppointmentStatus };
