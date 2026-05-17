// payment routes file using demo payment

import express from 'express';
import * as paymentsController from '../controllers/paymentsController.js';
const router = express.Router();

// create a new payment
router.post('/', paymentsController.createPayment);

// get all payments
router.get('/', paymentsController.getAllPayments);

// get a payment by ID
router.get('/:id', paymentsController.getPaymentById);

// update payment
router.put('/:id', paymentsController.updatePaymentById);

// delete a payment
router.delete('/:id', paymentsController.deletePaymentById);

export default router;