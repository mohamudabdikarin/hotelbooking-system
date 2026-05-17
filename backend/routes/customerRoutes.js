
import express from 'express';
import * as customerController from '../controllers/customerController.js';
const router = express.Router();

// Create a new customer
router.post('/', customerController.createCustomer);

// Get all customers
router.get('/', customerController.getAllCustomers);


// Get a customer by ID
router.get('/:id', customerController.getCustomerById);


// Update a customer by ID
router.put('/:id', customerController.updateCustomerById);


// Delete a customer by ID
router.delete('/:id', customerController.deleteCustomerById);

export default router;

