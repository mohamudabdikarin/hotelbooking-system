import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import paymentsRoutes from './routes/paymentsRoutes.js';
import roomsRoutes from './routes/roomsRouter.js';


dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/rooms', roomsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`Server running on port ${port}`));
