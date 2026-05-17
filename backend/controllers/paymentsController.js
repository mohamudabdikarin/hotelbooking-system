// this is payments controller,

import Payments from '../models/Payments.js';

// create a new payment
export const createPayment = async (req, res) => {
    try {
        const { amount, method, status } = req.body;
        const payment = new Payments({
            amount,
            method,
            status
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {        res.status(500).json({ message: 'Error creating payment', error });
    }
};

// get all payments
export const getPayments = async (req, res) => {
    try {
        const payments = await Payments.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
};

// get a payment by id
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payments.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {   
        res.status(500).json({ message: 'Error fetching payment', error });
    }
};

// update a payment
export const updatePayment = async (req, res) => {
    try {
        const { amount, method, status } = req.body;
        const payment = await Payments.findByIdAndUpdate(
            req.params.id,
            { amount, method, status },
            { new: true }
        );
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error });
    }
};  
