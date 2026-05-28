const appointmentService = require('../services/appointmentService');

const bookAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.bookAppointment(req.user.id, req.body);
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getPatientAppointments(req.user.id);
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

const getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getDoctorAppointments(req.user.id, req.query);
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateAppointmentStatus(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};

module.exports = { bookAppointment, getPatientAppointments, getDoctorAppointments, updateAppointmentStatus };
