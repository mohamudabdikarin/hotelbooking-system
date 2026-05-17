// this is booking routes file, where we will define all the routes

import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
const router = express.Router();

router.post('/', bookingController.createBooking);

router.get('/', bookingController.getAllBookings);

router.put('/:id', bookingController.updateBookingById);

router.delete('/:id', bookingController.deleteBookingById);

export default router;