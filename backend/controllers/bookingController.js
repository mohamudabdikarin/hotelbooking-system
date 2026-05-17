import Booking from '../models/Bookings.js';

export const createBooking = async (req, res) => {
    try {
        const bookingData = { ...req.body, user: req.user.id };
        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'customer') {
            bookings = await Booking.find({ user: req.user.id }).populate('room').populate('user', 'name email');
        } else {
            bookings = await Booking.find().populate('room').populate('user', 'name email');
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('room').populate('user', 'name email');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (req.user.role === 'customer' && booking.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error });
    }
};

export const updateBookingById = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('room').populate('user', 'name email');
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error });
    }
};

export const deleteBookingById = async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error });
    }
};