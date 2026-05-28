const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('PATIENT'), appointmentController.bookAppointment);
router.get('/patient', authMiddleware, roleMiddleware('PATIENT'), appointmentController.getPatientAppointments);
router.get('/doctor', authMiddleware, roleMiddleware('DOCTOR'), appointmentController.getDoctorAppointments);
router.patch('/:id/status', authMiddleware, roleMiddleware('DOCTOR'), appointmentController.updateAppointmentStatus);

module.exports = router;
