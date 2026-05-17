// this is roomsController file, it manages all cruid operations for rooms
import Room from '../models/Rooms.js';

// create a new room
export const createRoom = async (req, res) => {
    try {
        const newRoom = new Room(req.body);
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {        res.status(500).json({ message: 'Error creating room', error });
    }
};

// get all rooms
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error });
    }
};

// get a room by ID
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {        res.status(500).json({ message: 'Error fetching room', error });
    }
};

// update room by ID
export const updateRoomById = async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(updatedRoom);
    } catch (error) {        res.status(500).json({ message: 'Error updating room', error });
    }
};

// delete a room by ID  

export const deleteRoomById = async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }   
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
                res.status(500).json({ message: 'Error deleting room', error });
    } 
};