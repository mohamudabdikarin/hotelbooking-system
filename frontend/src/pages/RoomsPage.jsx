import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const result = await api.getRooms();
      if (Array.isArray(result)) {
        setRooms(result);
      } else {
        setError('Failed to fetch rooms');
      }
    } catch (err) {
      setError('Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (roomId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Available Rooms</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-xl text-gray-600">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center text-xl text-gray-600">No rooms available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Price per night</p>
                      <p className="text-2xl font-bold text-blue-600">${room.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Max Occupancy</p>
                      <p className="text-2xl font-bold text-gray-700">{room.maxCount}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookRoom(room._id)}
                    className="w-full bg-blue-600 text-white cursor-pointer py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
