import Payments from '../models/Payment.js';

export const createPayment = async (req, res) => {
    try {
        const { amount, method, status, bookingId } = req.body;
        const payment = new Payments({
            user: req.user.id,
            booking: bookingId,
            amount,
            paymentMethod: method,
            isPaid: status === 'paid'
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {        
        res.status(500).json({ message: 'Error creating payment', error });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payments.find().populate('user', 'name email').populate('booking');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payments.findById(req.params.id).populate('user', 'name email').populate('booking');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {   
        res.status(500).json({ message: 'Error fetching payment', error });
    }
};

export const updatePaymentById = async (req, res) => {
    try {
        const { amount, method, status } = req.body;
        const payment = await Payments.findByIdAndUpdate(
            req.params.id,
            { amount, paymentMethod: method, isPaid: status === 'paid' },
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

export const deletePaymentById = async (req, res) => {
    try {
        const payment = await Payments.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error });
    }
};
