// booking model
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'Room',
        required: true, 
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model('Booking', bookingSchema);