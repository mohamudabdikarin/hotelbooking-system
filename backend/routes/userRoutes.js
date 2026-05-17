import express from 'express';
import { registerUser, authUser, getUserProfile, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authorize.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

router.get('/', protect, authorize('admin', 'receptionist'), getAllUsers);
router.get('/:id', protect, authorize('admin', 'receptionist', 'customer'), getUserById);
router.put('/:id', protect, authorize('admin', 'customer'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;