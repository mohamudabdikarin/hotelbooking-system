import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('admin', 'receptionist', 'customer'), bookingController.createBooking);
router.get('/', authorize('admin', 'receptionist', 'customer'), bookingController.getAllBookings);
router.get('/:id', authorize('admin', 'receptionist', 'customer'), bookingController.getBookingById);
router.put('/:id', authorize('admin', 'receptionist'), bookingController.updateBookingById);
router.delete('/:id', authorize('admin', 'receptionist'), bookingController.deleteBookingById);

export default router;