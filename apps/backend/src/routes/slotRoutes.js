const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/doctor/:doctorId', slotController.getDoctorSlots);
router.post('/', authMiddleware, roleMiddleware('DOCTOR'), slotController.createSlot);
router.delete('/:id', authMiddleware, roleMiddleware('DOCTOR'), slotController.deleteSlot);

module.exports = router;
