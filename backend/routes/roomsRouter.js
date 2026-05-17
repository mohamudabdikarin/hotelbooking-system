import express from 'express';
import * as roomsController from '../controllers/roomsController.js';
import { protect, authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'receptionist', 'customer'), roomsController.getAllRooms);
router.get('/:id', authorize('admin', 'receptionist', 'customer'), roomsController.getRoomById);
router.post('/', authorize('admin', 'receptionist'), roomsController.createRoom);
router.put('/:id', authorize('admin'), roomsController.updateRoomById);
router.delete('/:id', authorize('admin'), roomsController.deleteRoomById);

export default router;
