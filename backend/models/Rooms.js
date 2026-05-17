import mongoose from 'mongoose';
// this is rooms model of the hotel management system
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },  
    maxCount: {
        type: Number,
        required: true
    },
    description: {
        type: String,   
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model('Room', userSchema);
