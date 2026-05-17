import Customer from '../models/Customers.js';

export const getAllCustomers = async (req, res) => {
  try {
    let customers;
    if (req.user.role === 'customer') {
      customers = await Customer.find({ user: req.user.id });
    } else {
      customers = await Customer.find();
    }
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    if (req.user.role === 'customer' && customer.user?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customerData = { ...req.body, user: req.user.id };
    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
};

export const updateCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    if (req.user.role === 'customer' && customer.user?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
};

export const deleteCustomerById = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};


