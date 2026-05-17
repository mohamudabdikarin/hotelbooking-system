import express from 'express';
import * as paymentsController from '../controllers/paymentsController.js';
import { protect, authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'receptionist', 'customer'), paymentsController.getAllPayments);
router.get('/:id', authorize('admin', 'receptionist', 'customer'), paymentsController.getPaymentById);
router.post('/', authorize('admin', 'customer'), paymentsController.createPayment);
router.put('/:id', authorize('admin'), paymentsController.updatePaymentById);
router.delete('/:id', authorize('admin'), paymentsController.deletePaymentById);

export default router;