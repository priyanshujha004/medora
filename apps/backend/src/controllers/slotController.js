const slotService = require('../services/slotService');

const createSlot = async (req, res, next) => {
  try {
    const slot = await slotService.createSlot(req.user.id, req.body);
    res.status(201).json(slot);
  } catch (err) {
    next(err);
  }
};

const getDoctorSlots = async (req, res, next) => {
  try {
    const slots = await slotService.getDoctorSlots(req.params.doctorId, req.query);
    res.status(200).json(slots);
  } catch (err) {
    next(err);
  }
};

const deleteSlot = async (req, res, next) => {
  try {
    await slotService.deleteSlot(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { createSlot, getDoctorSlots, deleteSlot };
