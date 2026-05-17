import express from 'express';
import * as paymentsController from '../controllers/paymentsController.js';
import { protect, authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'receptionist'), paymentsController.getAllPayments);
router.get('/:id', authorize('admin', 'receptionist'), paymentsController.getPaymentById);
router.post('/', authorize('admin'), paymentsController.createPayment);
router.put('/:id', authorize('admin'), paymentsController.updatePaymentById);
router.delete('/:id', authorize('admin'), paymentsController.deletePaymentById);

export default router;