import express from 'express';
import * as roomsController from '../controllers/roomsController.js';
import { protect, authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', roomsController.getAllRooms);
router.get('/:id', roomsController.getRoomById);

router.use(protect);
router.post('/', authorize('admin', 'receptionist'), roomsController.createRoom);
router.put('/:id', authorize('admin'), roomsController.updateRoomById);
router.delete('/:id', authorize('admin'), roomsController.deleteRoomById);

export default router;
