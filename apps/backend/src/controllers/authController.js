const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updatePatientProfile = async (req, res, next) => {
  try {
    const updated = await authService.updatePatientProfile(req.user.id, req.body);
    res.status(200).json({ message: 'Profile updated successfully', profile: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updatePatientProfile };