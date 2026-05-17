
import express from 'express';
import * as customerController from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'receptionist', 'customer'), customerController.getAllCustomers);
router.get('/:id', authorize('admin', 'receptionist', 'customer'), customerController.getCustomerById);
router.post('/', authorize('admin', 'receptionist'), customerController.createCustomer);
router.put('/:id', authorize('admin', 'customer'), customerController.updateCustomerById);
router.delete('/:id', authorize('admin'), customerController.deleteCustomerById);

export default router;

