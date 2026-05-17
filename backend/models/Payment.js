import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    isPaid: {
        type: Boolean,
        required: true, 
        default: false
    },
    paidAt: {
        type: Date
    }
}, {
    timestamps: true    
},)

export default mongoose.model('Payment', paymentSchema);