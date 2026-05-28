const prisma = require('../config/db');

const createSlot = async (doctorId, { date, startTime, endTime }) => {
  if (!date || !startTime || !endTime) {
    throw { status: 400, message: 'date, startTime, and endTime are required' };
  }
  const slot = await prisma.availabilitySlot.create({
    data: { doctorId, date: new Date(date), startTime, endTime },
  });
  return slot;
};

const getDoctorSlots = async (doctorId, { date, availableOnly } = {}) => {
  const where = { doctorId };
  if (date) where.date = new Date(date);
  if (availableOnly === 'true') where.isBooked = false;

  return prisma.availabilitySlot.findMany({
    where,
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
};

const deleteSlot = async (slotId, doctorId) => {
  const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
  if (!slot) throw { status: 404, message: 'Slot not found' };
  if (slot.doctorId !== doctorId) throw { status: 403, message: 'Access denied' };
  if (slot.isBooked) throw { status: 400, message: 'Cannot delete a booked slot' };
  await prisma.availabilitySlot.delete({ where: { id: slotId } });
};

module.exports = { createSlot, getDoctorSlots, deleteSlot };
