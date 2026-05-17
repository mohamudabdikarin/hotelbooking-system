// rooms router file
import express from 'express';
import * as roomsController from '../controllers/roomsController.js';
const router = express.Router();

// create a new room
router.post('/', roomsController.createRoom);

// get all rooms
router.get('/', roomsController.getAllRooms);

// get a room by ID
router.get('/:id', roomsController.getRoomById);

// update room
router.put('/:id', roomsController.updateRoomById);

// delete a room
router.delete('/:id', roomsController.deleteRoomById);


export default router;
