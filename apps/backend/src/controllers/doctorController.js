const doctorService = require('../services/doctorService');

const getAllDoctors = async (req, res, next) => {
  try {
    const { search, speciality, sortFees } = req.query;
    const doctors = await doctorService.getAllDoctors({ search, speciality, sortFees });
    res.status(200).json(doctors);
  } catch (err) {
    next(err);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.status(200).json(doctor);
  } catch (err) {
    next(err);
  }
};

const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateDoctorProfile(req.user.id, req.body);
    res.status(200).json(doctor);
  } catch (err) {
    next(err);
  }
};
const getSpecialities = async (req, res, next) => {
  try {
    const specialities = await doctorService.getSpecialities();
    res.status(200).json(specialities);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllDoctors, getDoctorById, updateDoctorProfile, getSpecialities };
